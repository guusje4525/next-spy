import { Entity, EntityItem } from "electrodb";
import dbConfig from "../config";

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
);

export type UserEntityType = EntityItem<typeof UserEntity>;
