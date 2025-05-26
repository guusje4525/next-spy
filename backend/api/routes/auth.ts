import { router, protectedProcedure, baseProcedure } from "../router"
import { z } from "zod"
import { UserChallengeEntity } from "../../database/entities/user-challenge"
import { UserEntity } from "../../database/entities/user"
import { base64urlToBuffer, secretKey } from "../../utils/utils"
import UserService from "../../services/UserService"
import UserChallengeService from "../../services/UserChallengeService"
import notNull from "../../utils/notNull"
import PasskeyService from "../../services/PasskeyService"
import { sign } from "jsonwebtoken"

export default router({
    registerRequest: baseProcedure.input(z.object({ username: z.string().min(1) })).mutation(async ({ input: { username } }) => {
        const options = await PasskeyService.getOptions(username)

        const user = await UserChallengeService.getByUser(username)
        if (user) {
            throw new Error("Username already taken")
        }

        await UserChallengeEntity.delete({ userId: username }).go()

        await UserChallengeEntity.create({
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

            const credentials = await PasskeyService.getVerificationResponse({
                credential,
                challenge,
            })
            await UserEntity.create({
                id: username,
                credentials: credentials,
            }).go()

            await UserChallengeEntity.delete({ userId: username }).go()

            return { success: true }
        }),

    loginRequest: baseProcedure.input(z.object({ username: z.string().min(1) })).mutation(async ({ input: { username } }) => {
        const options = await PasskeyService.getLoginOptions()

        // Dont accept challenge if user is not found
        if (!(await UserService.getUser(username))) {
            console.log("User not found")
            return { options }
        }

        await UserChallengeEntity.delete({ userId: username }).go()
        await UserChallengeEntity.create({
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
            try {
                console.log(1)
                const challenge = await getChallengeFromCredential(credential, userID)

                console.log(2)

                const newCounter = await PasskeyService.verifyAuthenticationResponse({
                    credential,
                    challenge,
                    user,
                })

                console.log(3)

                await UserService.updateCredentials(userID, {
                    credentialID: user.credentials.credentialID,
                    credentialPublicKey: user.credentials.credentialPublicKey,
                    counter: newCounter,
                })

                console.log(4)

                await UserChallengeEntity.delete({ userId: userID }).go()

                const token = sign({ userId: userID }, secretKey, {
                    expiresIn: "1d",
                })

                return { success: true, userID, token }
            } catch (error: any) {
                await UserChallengeEntity.delete({ userId: userID }).go()
                throw error
            }
        }),
    protected: protectedProcedure.query(({ ctx }) => {
        console.log("Protected route!", ctx)
    }),
})

const getChallengeFromCredential = async (credential: any, username: string): Promise<string> => {
    const clientDataJSONBuffer = base64urlToBuffer(credential.response.clientDataJSON)
    const clientDataJSON = JSON.parse(new TextDecoder().decode(clientDataJSONBuffer))

    const challengeRecord = await UserChallengeService.getByUser(username)

    if (!challengeRecord || !challengeRecord.challenge || challengeRecord.challenge !== clientDataJSON.challenge) {
        console.error(`Challenge error for username ${username}`, challengeRecord)
        throw new Error("Unhandeld error")
    }

    return challengeRecord.challenge
}
