import { Entity, EntityItem } from 'electrodb'
import dbConfig from '../config'

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
                required: true
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
                    composite: [],
                },
            },
        },
    },
    dbConfig
)

export type ConfigEntityType = EntityItem<typeof ConfigEntity>
