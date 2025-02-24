export default async (id: number) => {
    const rawResult = await fetch('https://pricespy.co.nz/_internal/bff', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `query productPage($id: Int!) {
                product(id: $id) {
                    name
                    priceSummary {
                        regular
                    }
                }
            }`,
            "variables": { id },
            "operationName": "productPage"
        }),
    })

    const result = await rawResult.json()

    if (!result.data?.product?.priceSummary) {
        // Invalid data?
        return null
    }

    return {
        name: result.data.product.name,
        price: result.data.product.priceSummary.regular
    }
}
