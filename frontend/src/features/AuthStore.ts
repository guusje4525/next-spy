import { base64urlToArrayBuffer, base64urlToUint8Array } from "../utils/ArrayBufferUtils"
import Loader from "../utils/loader/Loader"
import { createStoreContext } from "../utils/storeUtils"
import apiClient from "../utils/api"

export type AuthState = "register" | "login" | "loading" | "unsupported" | "authenticated"

export default class AuthStore {
  fields = {
    username: "",
  }
  loader = new Loader(true)
  registerLoader = new Loader(false)
  private passkeySupported = false
  isRegistering = false
  isAuthenticated = false
  errorText: string | undefined = undefined

  constructor() {
    if (localStorage.token) {
      this.isAuthenticated = true
    }
  }

  get state(): AuthState {
    if (this.isAuthenticated) {
      return "authenticated"
    }
    if (this.loader.isLoading) {
      return "loading"
    }
    if (!this.passkeySupported) {
      return "unsupported"
    }
    if (this.isRegistering) {
      return "register"
    }
    return "login"
  }

  getPasskeySupported = async () => {
    await this.loader.executeLoading(async () => {
      if (typeof window.PublicKeyCredential?.isConditionalMediationAvailable === "function") {
        this.passkeySupported = await window.PublicKeyCredential.isConditionalMediationAvailable()
      }
    })
  }

  onUserNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    this.fields.username = "" + value
    this.errorText = undefined
  }

  login = async () => {
    if (!(this.fields.username?.length > 1)) {
      this.errorText = "Username cannot be empty"
      return
    }
    const { options } = await apiClient.auth.loginRequest.mutate({
      username: this.fields.username,
    })

    const publicKey = {
      ...options,
      challenge: base64urlToUint8Array(options.challenge),
      allowCredentials: options.allowCredentials?.map((cred: any) => ({
        ...cred,
        id: base64urlToUint8Array(cred.id),
      })),
    }
    const assertion = await navigator.credentials.get({ publicKey })

    const result = await apiClient.auth.loginResponse.mutate({
      credential: assertion,
    })
    if (result.success) {
      this.isAuthenticated = true
      localStorage.token = result.token
    } else {
      alert("No success with the login")
    }
  }

  register = async () => {
    if (!(this.fields.username?.length > 1)) {
      this.errorText = "Username cannot be empty"
      return
    }
    await this.registerLoader.executeLoading(async () => {
      try {
        const options = await apiClient.auth.registerRequest.mutate({
          username: this.fields.username,
        })
        const publicKey: PublicKeyCredentialCreationOptions = {
          ...options,
          challenge: base64urlToArrayBuffer(options.challenge),
          user: {
            ...options.user,
            id: base64urlToArrayBuffer(options.user.id),
          },
          excludeCredentials: (options.excludeCredentials || [])?.map((cred) => ({
            // ...cred,
            type: cred.type,
            transports: cred.transports as any,
            id: base64urlToArrayBuffer(cred.id),
          })),
        }

        const cred = await navigator.credentials.create({ publicKey })
        const res = await apiClient.auth.registerResponse.mutate({ username: this.fields.username, credential: cred })
        if (res.success) {
          alert("Register successfull, please login")
          this.isRegistering = false
        } else {
          alert("Register unsuccessfull")
        }
      } catch (error: any) {
        this.errorText = "Unknown error"
      }
    })
  }

  goToLogin = () => {
    this.isRegistering = false
  }

  goToRegister = () => {
    this.isRegistering = true
  }
}

export const { Provider: AuthStoreProvider, useProvidedStore: useAuthStore } = createStoreContext(AuthStore)
