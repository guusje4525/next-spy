import { z } from "zod"
import router from "../router"
import { ConfigEntity } from "../../database/entities/config"

export default router.router({
    get: router.procedure
        .query(async () => {
            const config = await ConfigEntity.query.primary({}).go({ pages: 'all', limit: 1 })
            return config.data[0] || null
        }),

    set: router.procedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input: { userId } }) => {
            await ConfigEntity.delete({}).go()
            await ConfigEntity.create({ userId }).go()
        }),
})
