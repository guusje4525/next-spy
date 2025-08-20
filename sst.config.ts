/// <reference path="./.sst/platform/config.d.ts" />

import { TableStack } from "./stacks/TableStack";
import { CronStack } from "./stacks/CronStack";
import { ApiStack } from "./stacks/ApiStack";
import { SiteStack } from "./stacks/SiteStack";

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
        const { cron, cronUrn } = CronStack({ table })

        // Create the API stack with table dependency
        const { trpc, apiUrl } = ApiStack({ table })

        // Create the site stack with API URL dependency
        const { client, clientUrl } = SiteStack({ apiUrl })

        return {
            api: apiUrl,
            client: clientUrl,
            tableName: tableName,
            cron: cronUrn,
        }
    },
})
