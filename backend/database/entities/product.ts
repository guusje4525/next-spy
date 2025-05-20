import { Entity, EntityItem } from 'electrodb'
import dbConfig from '../config'

export const ProductEntity = new Entity(
  {
    model: {
      entity: "product",
      version: "1",
      service: "product",
    },
    attributes: {
      id: {
        type: "number",
        required: true
      },
      price: {
        type: "number",
        required: true,
        default: 0
      },
      name: {
        type: 'string',
        required: true
      },
      lastUpdatedAt: {
        type: 'string',
        required: true,
        default: new Date().toISOString(),
      }
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

export type ProductEntityType = EntityItem<typeof ProductEntity>
