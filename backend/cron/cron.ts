import { ConfigEntity } from "../database/entities/config";
import { ProductEntity } from "../database/entities/product";
import Pushover from "../utils/Pushover";
import pricespy from "./pricespy";

export const handler = async () => {
    console.log("Cron job executed at:", new Date().toISOString())

    const products = await ProductEntity.query.primary({}).go({ pages: 'all' })

    const config = await ConfigEntity.query.primary({}).go({ pages: 'all', limit: 1 })

    for (const product of products.data) {
        const productData = await pricespy(product.id)
        // If product is found
        if (productData) {
            // Update records
            await ProductEntity.patch(product).set({ price: productData.price, lastUpdatedAt: new Date().toISOString() }).go()
            // If new price is lower than currently saved price
            if (product.price > productData.price && config.data[0]?.userId) {
                Pushover.send(config.data[0].userId, 'Price updated', `Detected a lower price($${product.price - productData.price} drop) for ${product.name}`)
            }
        }
        // Wait 5 second before going to the next
        await new Promise(f => setTimeout(f, 5000))
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Cron job successfully executed!",
        }),
    }
}