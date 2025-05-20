import { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import { initTRPC } from "@trpc/server";
import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

export default initTRPC
  .context<CreateAWSLambdaContextOptions<APIGatewayProxyEvent | APIGatewayProxyEventV2>>()
  .create()
