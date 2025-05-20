import router from "../router"
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server"
import { ulid } from "ulid"
import { z } from "zod"
import { UserChallengeEntity } from "../../database/entities/user-challenge"
import { UserEntity } from "../../database/entities/user"
import { base64urlToBuffer } from "../../utils/utils"

const rpName = "Next Spy" // User-visible, "friendly" website/service name
const rpID = "localhost" // Valid domain name (after `https://`)
const origin = "http://localhost:5173"

export default router.router({
  registerRequest: router.procedure.mutation(async ({ ctx }) => {
    const userID = ulid()

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: Buffer.from(userID, "utf8"),
      userName: userID,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
    })

    await UserChallengeEntity.put({
      userId: userID,
      challenge: options.challenge,
    }).go()

    return { options, userID }
  }),

  registerResponse: router.procedure
    .input(
      z.object({
        userID: z.string(),
        credential: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const { userID, credential } = input

      const { data: challengeRecord } = await UserChallengeEntity.get({
        userId: userID,
      }).go()

      if (!challengeRecord) throw new Error("No challenge found")

      const expectedChallenge = challengeRecord.challenge

      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      })

      if (!verification.verified) {
        throw new Error("Failed to verify passkey")
      }

      const { registrationInfo } = verification
      if (!registrationInfo) {
        throw new Error("No registrationInfo")
      }

      await UserEntity.put({
        id: userID,
        credentials: {
          credentialID: registrationInfo.credential.id,
          credentialPublicKey: Buffer.from(registrationInfo.credential.publicKey).toString("base64"),
          counter: registrationInfo.credential.counter,
        },
      }).go()

      await UserChallengeEntity.delete({ userId: userID }).go()

      console.log("registerResponse", userID)

      return { success: true }
    }),

  loginRequest: router.procedure.mutation(async () => {
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "required",
    })

    // Challenge is not user-specific in this case, since we'll get userID from userHandle
    await UserChallengeEntity.put({
      userId: options.challenge, // temporarily using challenge as key
      challenge: options.challenge,
    }).go()

    return { options }
  }),

  loginResponse: router.procedure
    .input(
      z.object({
        credential: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const { credential } = input
      const rawId = credential?.rawId

      const userHandle = credential?.response?.userHandle
      if (!userHandle) throw new Error("No userHandle provided")

      const userID = new TextDecoder().decode(typeof userHandle === "string" ? Buffer.from(userHandle, "base64") : userHandle)

      const { data: user } = await UserEntity.get({ id: userID }).go()
      if (!user) throw new Error("User not found")

      const clientDataJSONBuffer = base64urlToBuffer(credential.response.clientDataJSON)

      const clientDataJSON = JSON.parse(new TextDecoder().decode(clientDataJSONBuffer))

      const { data: challengeRecord } = await UserChallengeEntity.get({
        userId: clientDataJSON.challenge,
      }).go()

      if (!challengeRecord) throw new Error("Challenge not found")

      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: user.credentials.credentialID,
          publicKey: Buffer.from(user.credentials.credentialPublicKey, "base64"),
          counter: user.credentials.counter,
        },
      })

      if (!verification.verified) throw new Error("Authentication failed")

      await UserEntity.update({ id: userID })
        .set({
          credentials: {
            ...user.credentials,
            counter: verification.authenticationInfo.newCounter,
          },
        })
        .go()

      await UserChallengeEntity.delete({ userId: challengeRecord.userId }).go()

      return { success: true, userID }
    }),
})
