import { UserChallengeDto, UserChallengeEntity } from "../database/entities/user-challenge"

export default class UserChallengeService {
    static getByChallenge = async (challenge: any): Promise<UserChallengeDto | null> => {
        const { data } = await UserChallengeEntity.query
            .primary({
                challenge,
            })
            .go({ limit: 1 })
        return data[0]
    }

    static getByUser = async (username: string): Promise<UserChallengeDto | null> => {
        const { data } = await UserChallengeEntity.query
            .primary({
                userId: username,
            })
            .go({ limit: 1 })
        return data[0]
    }
}
