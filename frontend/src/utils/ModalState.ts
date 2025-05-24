import { makeAutoObservable } from "mobx"

export type ModalCloseReasons = "default" | "without-saving" | "succeeded"

export interface ModalStateParams {
    onOpen?: () => boolean | void
    onClose?: (reason: ModalCloseReasons) => Promise<boolean | void> | boolean | void
    /** When closing this modal, always close without saving */
    closeWithoutSaving?: boolean
    initial?: boolean
}

export default class ModalState {
    params: ModalStateParams
    visible

    constructor(params: ModalStateParams = {}) {
        this.params = params
        this.visible = params.initial ?? false
        makeAutoObservable(this)
    }

    toggle = () => {
        if (this.visible) {
            this.close()
        } else {
            this.open()
        }
    }

    open = () => {
        const should = this.params.onOpen && this.params.onOpen()
        if (typeof should === "undefined" || should) {
            this.visible = true
        }
    }

    close = async () => {
        const should = this.params.onClose && (await this.params.onClose(this.params.closeWithoutSaving ? "without-saving" : "default"))
        if (typeof should === "undefined" || should) {
            this.visible = false
        }
    }

    closeWithReason = async (reason: ModalCloseReasons) => {
        const should = this.params.onClose && (await this.params.onClose(reason))
        if (typeof should === "undefined" || should) {
            this.visible = false
        }
    }

    closeWithoutSaving = async () => {
        const should = this.params.onClose && (await this.params.onClose("without-saving"))
        if (typeof should === "undefined" || should) {
            this.visible = false
        }
    }
}
