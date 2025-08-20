interface CronStackProps {
    table: sst.aws.Dynamo
}

export function CronStack({ table }: CronStackProps) {
    const cron = new sst.aws.Cron("MyCronJob", {
        schedule: "rate(4 hours)",
        job: {
            handler: "backend/cron/cron.handler",
            timeout: "60 seconds",
            environment: {
                TABLE_NAME: table.arn,
            },
            link: [table],
            name: "Cron-service",
            description: "This runs every 4 hours to update our cache",
        },
    })

    return {
        cron,
        cronUrn: cron.urn,
    }
}
