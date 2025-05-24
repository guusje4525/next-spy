import { z } from "zod"
import { router, protectedProcedure } from "../router"
import { ProductEntity } from "../../database/entities/product"
import pricespy from "../../cron/pricespy"

export default router({
    list: protectedProcedure.query(async ({ ctx: { userId } }) => {
        const products = await ProductEntity.query.primary({ userId }).go({ pages: "all" })
        return products.data
    }),

    create: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx: { userId } }) => {
        const data = await pricespy(input.id)
        if (data) {
            return await ProductEntity.create({
                id: input.id,
                name: data.name,
                price: data.price,
                userId,
            }).go()
        } else {
            return null
        }
    }),

    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx: { userId } }) => {
        await ProductEntity.delete({
            id: input.id,
            userId,
        }).go()
    }),
})
