import { z } from "zod"
import router from "../router"
import { ProductEntity } from "../../database/entities/product"
import pricespy from "../../cron/pricespy"

export default router.router({
  list: router.procedure
    .query(async () => {
      const products = await ProductEntity.query.primary({}).go({ pages: 'all' })
      return products.data
    }),

  create: router.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const data = await pricespy(input.id)
      if (data) {
        return await ProductEntity.create({
          id: input.id,
          name: data.name,
          price: data.price
        }).go()
      } else {
        return null
      }
    }),

  delete: router.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await ProductEntity.delete({
        id: input.id,
      }).go()
    })
})
