import { Entity, EntityItem } from "electrodb"
import dbConfig from "../config"
import { z } from "zod"

export const UserChallengeEntity = new Entity(
  {
    model: {
      entity: "user-challenge",
      version: "1",
      service: "user-challenge",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
      },
      challenge: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      primary: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["userId", "challenge"],
        },
      },
    },
  },
  dbConfig
)

export type UserChallengeEntityType = EntityItem<typeof UserChallengeEntity>

export const UserChallengeSchema = z.object({
  userId: z.string(),
  challenge: z.string(),
})
export type UserChallengeDto = z.output<typeof UserChallengeSchema>
