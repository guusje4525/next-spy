import { ProductEntity } from "../database/entities/product";
import pricespy from "./pricespy";

export const handler = async () => {
    console.log("Cron job executed at:", new Date().toISOString())

    const products = await ProductEntity.query.primary({}).go({ pages: 'all' })

    for (const product of products.data) {
        const productData = await pricespy(product.id)
        if (productData) {
            await ProductEntity.patch(product).set({ price: productData.price, lastUpdatedAt: new Date().toISOString() }).go()
        }
        // Wait 5 second before going to the next
        await new Promise(f => setTimeout(f, 5000))
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Cron job successfully executed!",
      }),
    };
  };