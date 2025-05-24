import { router, protectedProcedure, baseProcedure } from "../router"
import { z } from "zod"
import { UserChallengeEntity } from "../../database/entities/user-challenge"
import { UserEntity } from "../../database/entities/user"
import { base64urlToBuffer, secretKey } from "../../utils/utils"
import UserService from "../../services/UserService"
import UserChallengeService from "../../services/UserChallengeService"
import notNull from "../../utils/notNull"
import PasskeyService from "../../services/PasskeyService"
import jwt from "jsonwebtoken"

export default router({
  registerRequest: baseProcedure.input(z.object({ username: z.string().min(1) })).mutation(async ({ ctx, input: { username } }) => {
    const options = await PasskeyService.getOptions(username)

    notNull(await UserChallengeService.getByUser(username), "Username already taken")

    await UserChallengeEntity.put({
      userId: username,
      challenge: options.challenge,
    }).go()

    return options
  }),

  registerResponse: baseProcedure
    .input(
      z.object({
        username: z.string(),
        credential: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const { username, credential } = input

      const { challenge } = notNull(await UserChallengeService.getByUser(username), "No challenge found")

      notNull(await UserService.getUser(username), "User not found")

      const credentials = await PasskeyService.getVerificationResponse({
        credential,
        challenge,
      })
      await UserEntity.put({
        id: username,
        credentials: credentials,
      }).go()

      await UserChallengeEntity.delete({ userId: username, challenge }).go()

      console.log("registerResponse", username)

      return { success: true }
    }),

  loginRequest: baseProcedure.input(z.object({ username: z.string().min(1) })).mutation(async ({ input: { username } }) => {
    const options = await PasskeyService.getLoginOptions()

    // Dont accept challenge if user is not found
    if (!(await UserService.getUser(username))) {
      return { options }
    }

    await UserChallengeEntity.put({
      userId: username,
      challenge: options.challenge,
    }).go()

    return { options }
  }),

  loginResponse: baseProcedure
    .input(
      z.object({
        credential: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const credential = input.credential

      const userHandle = credential?.response?.userHandle
      if (!userHandle) throw new Error("No userHandle provided")

      const userID = new TextDecoder().decode(typeof userHandle === "string" ? Buffer.from(userHandle, "base64") : userHandle)

      const user = notNull(await UserService.getUser(userID), "User not found")

      const challenge = await getChallengeFromCredential(credential)

      const newCounter = await PasskeyService.verifyAuthenticationResponse({
        credential,
        challenge,
        user,
      })

      await UserService.updateCredentials(userID, {
        credentialID: user.credentials.credentialID,
        credentialPublicKey: user.credentials.credentialPublicKey,
        counter: newCounter,
      })

      await UserChallengeEntity.delete({ userId: userID, challenge: challenge }).go()

      const token = jwt.sign({ userId: userID }, secretKey, {
        expiresIn: "1d",
      })

      return { success: true, userID, token }
    }),
  protected: protectedProcedure.query(({ ctx }) => {
    console.log("Protected route!", ctx)
  }),
})

const getChallengeFromCredential = async (credential: any): Promise<string> => {
  const clientDataJSONBuffer = base64urlToBuffer(credential.response.clientDataJSON)
  const clientDataJSON = JSON.parse(new TextDecoder().decode(clientDataJSONBuffer))

  const challengeRecord = notNull(await UserChallengeService.getByChallenge(clientDataJSON.challenge), "Challenge not found")

  return challengeRecord.challenge
}
