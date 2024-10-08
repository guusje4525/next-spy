import { makeAutoObservable, runInAction } from "mobx"
import { ProductEntityType } from "../../../../backend/database/entities/product"
import apiClient from '../../api'
import { createStoreContext } from "../../utils/storeUtils"
import { formatDate } from "../../utils/DateUtils"

export default class ProductListStore {
    products: ProductEntityType[] = []

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

    delete = async (id: number) => {
        try {
            await apiClient.product.delete.mutate({ id })
            this.products = this.products.filter(product => product.id !== id)
        } catch (error: unknown) {
            // Do nothing
            console.log(error)
        }
    }

    add = async (id: number) => {
        const result = await apiClient.product.create.mutate({ id })
        if (result) {
            runInAction(() => {
                this.products.push(result.data)
            })
        } else {
            alert('Could not find product')
        }
    }
}

export const { Provider: ProductListStoreProvider, useProvidedStore: useProductListStore } = createStoreContext(ProductListStore)
