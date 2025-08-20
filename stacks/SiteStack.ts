interface SiteStackProps {
    apiUrl: sst.aws.Function["url"]
}

export function SiteStack({ apiUrl }: SiteStackProps) {
    const client = new sst.aws.StaticSite("Frontend", {
        path: "frontend",
        domain: "next-spy.guusje4525.com",
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
