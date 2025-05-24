import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { Router } from "../../../backend/api/trpcConfig"
import { snackbar } from "./Snackbar"

export default createTRPCClient<Router>({
    links: [
        httpBatchLink({
            url: import.meta.env.VITE_API_URL,
            async fetch(input: RequestInfo | URL, options?: RequestInit): Promise<Response> {
                const url = input
                options = options || ({ headers: {} } as RequestInit)

                const headers = options.headers as HeadersInit & { authorization: string; orgid: string | null }
                headers["authorization"] = `Bearer ${localStorage.token}`
                const response = await window.fetch(url, options)

                const responses = await response.clone().json()

                let handled = false

                if (!response.ok) {
                    for (const x of responses) {
                        if (x.error?.message === "jwt expired" && !handled) {
                            handled = true
                            delete localStorage.token
                            snackbar("Authentication expired, please login again")
                            window.location.reload()
                            return response
                        } else if (!handled) {
                            handled = true
                            snackbar(x.error?.message)
                            return response
                        }
                    }
                }

                return response
            },
        }),
    ],
})
