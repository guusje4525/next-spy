// stacks/WafStack.ts
/// <reference path="../.sst/platform/config.d.ts" />
import * as aws from "@pulumi/aws"

interface WafStackProps {
  apiGateway: sst.aws.ApiGatewayV2
}

export async function WafStack({ apiGateway }: WafStackProps) {
  // Create WAF Web ACL in us-east-1 (required for CloudFront)
  const usEast1Provider = new aws.Provider("us-east-1-provider", {
    region: "us-east-1",
  })

  const hostedZoneName = process.env.HOSTED_DOMAIN

  const customDomain = `api.${hostedZoneName}`

  const rateLimitRule: any = {
    name: "RateLimitRule",
    statement: {
      rateBasedStatement: {
        limit: 100,
        aggregateKeyType: "IP",
      },
    },
    priority: 1,
    action: { 
      block: {
        CustomResponse: {
          ResponseCode: 429
        }
      }
    },
    visibilityConfig: {
      cloudwatchMetricsEnabled: true,
      sampledRequestsEnabled: true,
      metricName: "MyAppRateLimitRule",
    },
  }

  // Create WAF Web ACL (must be CLOUDFRONT scope and in us-east-1)
  const webAcl = new aws.wafv2.WebAcl("ApiWebAcl", {
    defaultAction: { allow: {} },
    scope: "CLOUDFRONT",
    visibilityConfig: {
      cloudwatchMetricsEnabled: true,
      sampledRequestsEnabled: true,
      metricName: "ApiWebAcl",
    },
    rules: [rateLimitRule],
    customResponseBodies: [{
      key: "rate-limit-exceeded",
      contentType: "APPLICATION_JSON",
      content: JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests. Please try again later.",
        retryAfter: 300
      })
    }]
  }, { provider: usEast1Provider })

  // Extract the API domain from the URL
  const apiDomain = apiGateway.url.apply(url =>
    url.replace("https://", "").replace(/\/$/, "")
  )

  // Get the hosted zone
  const hostedZone = await aws.route53.getZone({
    name: hostedZoneName,
  })

  // Create SSL certificate for custom domain
  const certificate = new aws.acm.Certificate("ApiCertificate", {
    domainName: customDomain,
    validationMethod: "DNS",
  }, { provider: usEast1Provider }) // Certificate must be in us-east-1 for CloudFront

  // Create DNS validation records automatically
  const validationRecords = certificate.domainValidationOptions.apply(options => 
    options.map((option, index) => 
      new aws.route53.Record(`ApiCertValidation${index}`, {
        name: option.resourceRecordName,
        type: option.resourceRecordType,
        records: [option.resourceRecordValue],
        zoneId: hostedZone.zoneId,
        ttl: 300,
      })
    )
  )

  // Wait for certificate validation
  const certificateValidation = new aws.acm.CertificateValidation("ApiCertificateValidation", {
    certificateArn: certificate.arn,
    validationRecordFqdns: validationRecords.apply(records => records.map(r => r.fqdn)),
  }, { provider: usEast1Provider })

  // Create a custom response headers policy for CORS
  const responseHeadersPolicy = new aws.cloudfront.ResponseHeadersPolicy("ApiResponseHeadersPolicy", {
    corsConfig: {
      accessControlAllowCredentials: true,
      accessControlAllowHeaders: {
        items: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "Accept",
          "Origin",
          "Referer",
          "User-Agent",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "Access-Control-Request-Headers",
          "Access-Control-Request-Method",
        ],
      },
      accessControlAllowMethods: {
        items: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
      },
      accessControlAllowOrigins: {
        items: [
          `https://${hostedZoneName}`,
          "http://localhost:5173",
        ],
      },
      accessControlExposeHeaders: {
        items: [
          "Date",
          "Content-Type",
          "Content-Length",
          "ETag",
          "x-amz-request-id",
          "x-amz-id-2",
        ],
      },
      accessControlMaxAgeSec: 86400,
      originOverride: true,
    },
    customHeadersConfig: {
      items: [
        {
          header: "Cache-Control",
          value: "no-cache, no-store, must-revalidate",
          override: false,
        },
      ],
    },
  })

  // Create CloudFront distribution
  const distributionOptions = {
    enabled: true,
    comment: "CloudFront distribution for API Gateway with WAF",
    aliases: [customDomain],

    origins: [{
      domainName: apiDomain,
      originId: "apiGateway",
      customOriginConfig: {
        httpPort: 80,
        httpsPort: 443,
        originProtocolPolicy: "https-only",
        originSslProtocols: ["TLSv1.2"],
        originReadTimeout: 30,
        originKeepaliveTimeout: 5,
      },
    }],

    defaultCacheBehavior: {
      targetOriginId: "apiGateway",
      viewerProtocolPolicy: "redirect-to-https",
      
      allowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
      cachedMethods: ["GET", "HEAD", "OPTIONS"],
      
      forwardedValues: {
        queryString: true,
        headers: [
          "Authorization",
          "Content-Type",
          "Accept",
          "Origin",
          "Referer",
          "User-Agent",
          "Access-Control-Request-Headers",
          "Access-Control-Request-Method",
        ],
        cookies: {
          forward: "all",
        },
      },
      
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0,
      
      compress: true,
      
      responseHeadersPolicyId: responseHeadersPolicy.id,
    },

    restrictions: {
      geoRestriction: {
        restrictionType: "none",
      },
    },

    viewerCertificate: {
      acmCertificateArn: certificateValidation.certificateArn,
      sslSupportMethod: "sni-only",
      minimumProtocolVersion: "TLSv1.2_2021",
    },

    webAclId: webAcl.arn,
  }

  const distribution = new aws.cloudfront.Distribution("ApiDistribution", distributionOptions, {
    dependsOn: [certificateValidation]
  })

  // Create CNAME record for custom domain
  const cnameRecord = new aws.route53.Record("ApiCnameRecord", {
    name: customDomain,
    type: "CNAME",
    records: [distribution.domainName],
    zoneId: hostedZone.zoneId,
    ttl: 300,
  })

  // Output the CloudFront URL using custom domain
  const cloudfrontUrl = $interpolate`https://${customDomain}`

  // Log the rate limit settings
  console.log(`Custom API domain configured: ${customDomain}`)
  console.log(`SSL Certificate created for: ${customDomain}`)
  console.log(`SSL Certificate validation configured`)
  console.log(`Route 53 hosted zone found: ${hostedZoneName}`)

  return {
    webAcl,
    webAclArn: webAcl.arn,
    distribution,
    apiUrl: cloudfrontUrl,
    cloudfrontDomain: distribution.domainName,
    certificate,
    certificateValidation,
    customDomain,
    hostedZone,
    cnameRecord,
  }
}
