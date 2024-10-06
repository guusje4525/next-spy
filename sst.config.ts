/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "next-spy",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    }
  },
  async run() {
    const table = new sst.aws.Dynamo("MainTable", {
      fields: {
        pk: 'string',
        sk: 'string',
      },
      primaryIndex: {
        hashKey: 'pk',
        rangeKey: 'sk',
      }
    })

    const cron = new sst.aws.Cron("MyCronJob", {
      schedule: "rate(4 hours)",
      job: {
        handler: "backend/cron/cron.handler",
        timeout: "60 seconds",
        environment: {
          TABLE_NAME: table.arn
        },
        link: [table],
        name: 'Cron-service',
        description: 'This runs every 4 hours to update our cache'
      }
    })

    const trpc = new sst.aws.Function("Trpc", {
      url: true,
      handler: "backend/api/trpcConfig.handler",
      link: [table],
      environment: {
        TABLE_NAME: table.arn,
        PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN!
      },
      name: 'Trpc-api',
      description: 'This is the trpc api end point',
    })

    const client = new sst.aws.StaticSite("Frontend", {
      path: 'frontend',
      build: {
        command: 'npm run build',
        output: 'dist'
      },
      environment: {
        VITE_API_URL: trpc.url,
      }
    })

    return {
      api: trpc.url,
      client: client.url,
      tableName: table.arn,
      cron: cron.urn
    }
  },
})
