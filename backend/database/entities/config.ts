import { Entity, EntityItem } from "electrodb"
import dbConfig from "../config"
import { z } from "zod"

export const ConfigEntity = new Entity(
  {
    model: {
      entity: "config",
      version: "1",
      service: "config",
    },
    attributes: {
      userId: {
        type: "string",
        required: true,
      },
      pushOverId: {
        type: "string",
        required: false,
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
          composite: ["userId"],
        },
      },
    },
  },
  dbConfig
)

export type ConfigEntityType = EntityItem<typeof ConfigEntity>

export const ConfigSchema = z.object({
  userId: z.string(),
  pushOverId: z.string(),
})
export type ConfigDto = z.output<typeof ConfigSchema>
