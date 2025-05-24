import { makeAutoObservable, runInAction } from "mobx"
import { ProductEntityType } from "../../../../backend/database/entities/product"
import apiClient from "../../utils/api"
import { createStoreContext } from "../../utils/storeUtils"
import { formatDate } from "../../utils/DateUtils"
import { snackbar } from "../../utils/Snackbar"
import Loader from "../../utils/loader/Loader"

export default class ProductListStore {
    products: ProductEntityType[] = []
    loader = new Loader()
    constructor() {
        makeAutoObservable(this)
        this.fetch()
    }

    get lastUpdatedText() {
        return formatDate(this.products[0].lastUpdatedAt)
    }

    fetch = async () => {
        const products = await apiClient.product.list.query()
        this.products = products
    }

    delete = async (id: string) => {
        try {
            await apiClient.product.delete.mutate({ id })
            this.products = this.products.filter((product) => product.id !== id)
        } catch (error: unknown) {
            snackbar("Unable to delete product")
        }
    }

    add = async (id: number) => {
        await this.loader.executeLoading(async () => {
            const result = await apiClient.product.create.mutate({ id })
            if (result) {
                runInAction(() => {
                    this.products.push(result.data)
                })
            } else {
                snackbar("Could not find product")
            }
        })
    }
}

export const { Provider: ProductListStoreProvider, useProvidedStore: useProductListStore } = createStoreContext(ProductListStore)
