import Loader from "../../utils/loader/Loader"
import ModalState from "../../utils/ModalState"
import apiClient from "../../utils/api"
import { snackbar } from "../../utils/Snackbar"
import { createStoreContext } from "../../utils/storeUtils"

export default class ConfigStore {
    constructor() {}

    loader = new Loader()
    sendTestLoader = new Loader()
    config = {
        pushOverId: "",
    }
    fields = {
        pushOverId: "",
    }
    dialog = new ModalState()
    handleSubmit = async () => {
        await apiClient.config.set.mutate({ pushOverId: this.fields.pushOverId })
        this.dialog.close()
    }
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        this.fields.pushOverId = value
    }
    fetch = async () => {
        await this.loader.executeLoading(async () => {
            const res = await apiClient.config.get.query()
            if (res?.pushOverId) {
                this.fields.pushOverId = res.pushOverId
            }
        })
    }
    sendTest = async () => {
        await this.sendTestLoader.executeLoading(async () => {
            await apiClient.config.set.mutate({ pushOverId: this.fields.pushOverId })
            try {
                await apiClient.config.sendTest.query()
                snackbar("Notification send")
            } catch (error: any) {
                console.log("oops", error.message)
            }
        })
    }
}

export const { Provider: ConfigStoreProvider, useProvidedStore: useConfigStore } = createStoreContext(ConfigStore)
