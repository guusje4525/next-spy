import { z } from "zod"
import { router, protectedProcedure } from "../router"
import { ConfigEntity } from "../../database/entities/config"
import notNull from "../../utils/notNull"
import Pushover from "../../utils/Pushover"

export default router({
  get: protectedProcedure.query(async ({ ctx: { userId } }) => {
    const config = await ConfigEntity.query.primary({ userId }).go({ pages: "all", limit: 1 })
    return config.data[0] || null
  }),

  set: protectedProcedure.input(z.object({ pushOverId: z.string() })).mutation(async ({ ctx: { userId }, input: { pushOverId } }) => {
    await ConfigEntity.put({ userId, pushOverId }).go()
  }),
  sendTest: protectedProcedure.query(async ({ ctx: { userId } }) => {
    const { data } = await ConfigEntity.query.primary({ userId }).go({ pages: "all", limit: 1 })
    const pushOverId = notNull(data[0]?.pushOverId)

    await new Promise((resolve, reject) => {
      Pushover.send(pushOverId, "Test notification", "Hello from next-spy", function (res) {
        if (res?.errors?.length) {
          reject(res.errors[0])
        } else {
          resolve(res)
        }
      })
    })
  }),
})
