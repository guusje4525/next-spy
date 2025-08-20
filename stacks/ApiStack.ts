interface ApiStackProps {
    table: sst.aws.Dynamo
}

export function ApiStack({ table }: ApiStackProps) {
    const trpc = new sst.aws.Function("Trpc", {
        url: true,
        handler: "backend/api/trpcConfig.handler",
        link: [table],
        environment: {
            TABLE_NAME: table.arn,
            PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN!,
            RPID: process.env.RPID || "Not set",
            ORIGIN: process.env.ORIGIN || "Not set",
        },
        name: "Trpc-api",
        description: "This is the trpc api end point",
    })

    return {
        trpc,
        apiUrl: trpc.url,
    }
}
