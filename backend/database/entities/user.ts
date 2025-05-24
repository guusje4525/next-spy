import { Entity, EntityItem } from "electrodb"
import dbConfig from "../config"
import { z } from "zod"

export const UserEntity = new Entity(
  {
    model: {
      entity: "user",
      version: "1",
      service: "user",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      credentials: {
        type: "map",
        required: true,
        properties: {
          credentialID: {
            type: "string",
            required: true,
          },
          credentialPublicKey: {
            type: "string",
            required: true,
          },
          counter: {
            type: "number",
            required: true,
          },
        },
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
          composite: ["id"],
        },
      },
    },
  },
  dbConfig
)

export type UserEntityType = EntityItem<typeof UserEntity>

export const UserSchema = z.object({
  id: z.string(),
  credentials: z.object({
    credentialID: z.string(),
    credentialPublicKey: z.string(),
    counter: z.number(),
  }),
})
export type UserDto = z.output<typeof UserSchema>
