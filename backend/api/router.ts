// router.ts
import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda"
import { initTRPC } from "@trpc/server"
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda"
import jwt from "jsonwebtoken"
import { secretKey } from "../utils/utils"

const t = initTRPC.context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>().create()

export const middleware = t.middleware
export const baseProcedure = t.procedure
export const router = t.router

// Protected middleware
const protectedProcedureRoute = middleware(async (opts) => {
  const token = opts.ctx.event.headers.authorization?.split("Bearer ")[1]
  if (!token) {
    throw new Error("Missing token")
  }

  const user = jwt.verify(token, secretKey) as { userId?: string }

  if (!user?.userId) {
    throw new Error("Unauthorized")
  }

  return opts.next({
    ctx: {
      userId: user.userId,
    },
  })
})

export const protectedProcedure = baseProcedure.use(protectedProcedureRoute)
