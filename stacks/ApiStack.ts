interface ApiStackProps {
    table: sst.aws.Dynamo
}

export function ApiStack({ table }: ApiStackProps) {
    const hostedZoneName = process.env.HOSTED_DOMAIN

    const apiGateway = new sst.aws.ApiGatewayV2("MyApi", {
        transform: {
            route: {
                handler: (args, opts) => {
                    // Set the default if it's not set by the route
                    args.memory ??= "2048 MB";
                }
            }
        },
        cors: {
            allowCredentials: true,
            allowHeaders: ["*"],
            allowMethods: ["*"],
            allowOrigins: [
                `https://${hostedZoneName}`,
                "http://localhost:5173",
                `https://api.${hostedZoneName}`,
            ],
            exposeHeaders: ["*"],
            maxAge: "24 hours",
        },
    })

    apiGateway.route("$default", {
        handler: "backend/api/trpcConfig.handler",
        environment: {
            TABLE_NAME: table.arn,
            PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN!,
            RPID: process.env.RPID || "Not set",
            ORIGIN: process.env.ORIGIN || "Not set",
            ALLOWED_ORIGINS: `https://${hostedZoneName},http://localhost:5173,https://api.${hostedZoneName}`,
        },
        link: [table],
        name: "Trpc-api",
        description: "This is the trpc api end point",
        timeout: "30 seconds",
        memory: "512 MB",
    })

    return {
        apiGateway,
    }
}
