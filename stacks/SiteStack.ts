interface SiteStackProps {
    apiUrl: sst.aws.Function["url"]
}

export function SiteStack({ apiUrl }: SiteStackProps) {
    const hostedZoneName = process.env.HOSTED_DOMAIN

    const client = new sst.aws.StaticSite("Frontend", {
        path: "frontend",
        domain: hostedZoneName,
        build: {
            command: "npm run build",
            output: "dist",
        },
        environment: {
            VITE_API_URL: apiUrl,
        },
    })

    return { client }
}
