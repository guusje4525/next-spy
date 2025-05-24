import { z } from "zod"
import { router, protectedProcedure } from "../router"
import { ConfigEntity } from "../../database/entities/config"

export default router({
  get: protectedProcedure.query(async ({ ctx: { userId } }) => {
    const config = await ConfigEntity.query.primary({ userId }).go({ pages: "all", limit: 1 })
    return config.data[0] || null
  }),

  set: protectedProcedure.input(z.object({ pushOverId: z.string() })).mutation(async ({ ctx: { userId }, input: { pushOverId } }) => {
    await ConfigEntity.put({ userId, pushOverId }).go()
  }),
})
