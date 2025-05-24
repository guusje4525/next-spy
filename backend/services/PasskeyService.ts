import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import notNull from "../utils/notNull"
import { UserDto } from "../database/entities/user"

const rpName = "Next Spy" // User-visible, "friendly" website/service name
const rpID = "localhost" // Valid domain name (after `https://`)
const origin = "http://localhost:5173"

export default class PasskeyService {
  static getOptions = async (username: string) => {
    return await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from(username, "utf8"),
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    })
  }

  static getVerificationResponse = async (params: { credential: any; challenge: string }) => {
    const verification = await verifyRegistrationResponse({
      response: params.credential,
      expectedChallenge: params.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    })

    if (!verification.verified) {
      throw new Error("Failed to verify passkey")
    }

    const registrationInfo = notNull(verification.registrationInfo, "No registrationInfo")

    return {
      credentialID: registrationInfo.credential.id,
      credentialPublicKey: Buffer.from(registrationInfo.credential.publicKey).toString("base64"),
      counter: registrationInfo.credential.counter,
    }
  }

  static getLoginOptions = async () => {
    return await generateAuthenticationOptions({
      rpID,
      userVerification: "required",
    })
  }

  static verifyAuthenticationResponse = async (params: { credential: any; challenge: string; user: UserDto }): Promise<number> => {
    const verification = await verifyAuthenticationResponse({
      response: params.credential,
      expectedChallenge: params.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: params.user.credentials.credentialID,
        publicKey: Buffer.from(params.user.credentials.credentialPublicKey, "base64"),
        counter: params.user.credentials.counter,
      },
    })

    if (!verification.verified) throw new Error("Authentication failed")

    return verification.authenticationInfo.newCounter
  }
}
