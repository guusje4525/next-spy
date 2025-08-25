interface SiteStackProps {
    apiUrl: sst.aws.Function["url"]
    hostedZoneName: string
}

export function SiteStack({ apiUrl, hostedZoneName }: SiteStackProps) {
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

    return {
        client,
        clientUrl: client.url,
    }
}
