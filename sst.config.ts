/// <reference path="./.sst/platform/config.d.ts" />

import { TableStack } from "./stacks/TableStack";
import { CronStack } from "./stacks/CronStack";
import { ApiStack } from "./stacks/ApiStack";
import { SiteStack } from "./stacks/SiteStack";
import { WafStack } from "./stacks/WafStack";

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
        const { webAclArn, apiUrl, cloudfrontDomain } = await WafStack({ apiGateway })

        // Create the site stack with CloudFront URL
        const { client } = SiteStack({ apiUrl })

        return {
            directApi: apiGateway.url,
            cloudfrontApiUrl: apiUrl,
            client: client.url,
            tableName: tableName,
            cron: cronUrn,
            waf: webAclArn,
            cloudfrontDomain: cloudfrontDomain,
        }
    },
})
