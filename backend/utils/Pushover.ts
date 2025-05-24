/// <reference path="../../types/Pushover.d.ts" />
import Push from "pushover-notifications"

class Pushover {
    private static instance = (pushOverId: string) => {
        return new Push({
            user: pushOverId,
            token: process.env.PUSHOVER_TOKEN!,
        })
    }

    static send = async (params: { pushOverId: string; title: string; description: string }) => {
        await new Promise(async (resolve, reject) => {
            return Pushover.instance(params.pushOverId).send(
                {
                    message: params.description,
                    title: params.title,
                },
                (err: any, res: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                }
            )
        })
    }
}

export default Pushover
