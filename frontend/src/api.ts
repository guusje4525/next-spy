import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { Router } from "../../backend/api/trpcConfig";

export default createTRPCClient<Router>({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_API_URL,
      }),
    ],
  })