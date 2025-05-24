import { UserDto, UserEntity } from "../database/entities/user"

export default class UserService {
  static updateCredentials = async (username: string, credentials: UserDto["credentials"]) => {
    await UserEntity.update({ id: username })
      .set({
        credentials,
      })
      .go()
  }

  static getUser = async (username: string): Promise<UserDto | null> => {
    const { data: user } = await UserEntity.get({ id: username }).go()
    return user
  }
}
