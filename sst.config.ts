/// <reference path="./.sst/platform/config.d.ts" />

import { TableStack } from "./stacks/TableStack";
import { CronStack } from "./stacks/CronStack";
import { ApiStack } from "./stacks/ApiStack";
import { SiteStack } from "./stacks/SiteStack";
import { WafStack } from "./stacks/WafStack";

const hostedZoneName = "next-spy.guusje4525.com"

export default $config({
    app(input) {
        return {
            name: "next-spy",
            removal: input?.stage === "production" ? "retain" : "remove",
            home: "aws",
        }
    },
    async run() {
        // Create the table stack
        const { table, tableName } = TableStack()

        // Create the cron stack with table dependency
        const { cronUrn } = CronStack({ table })

        // Create the API stack with table dependency
        const { apiGateway } = ApiStack({ table })

        // Create the WAF stack with CloudFront for rate limiting and security
        // Uncomment the line below and set your desired API subdomain
        const { webAclArn, cloudfrontUrl, cloudfrontDomain } = await WafStack({ 
          apiGateway: apiGateway, 
          hostedZoneName
        })

        // IMPORTANT: Update the site stack to use CloudFront URL instead of direct API URL
        // Pass the CloudFront URL to your frontend
        const { clientUrl } = SiteStack({ apiUrl: cloudfrontUrl, hostedZoneName })

        return {
            api: apiGateway.url, // Direct API URL (for debugging/direct access)
            apiCloudfront: cloudfrontUrl, // CloudFront URL (use this in production)
            client: clientUrl,
            tableName: tableName,
            cron: cronUrn,
            waf: webAclArn,
            cloudfrontDomain: cloudfrontDomain, // Raw domain if you need to set up custom domain
        }
    },
})
