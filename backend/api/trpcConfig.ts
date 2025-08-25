import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda"
import { router } from "./router"
import ProductRouter from "./routes/product"
import ConfigRouter from "./routes/config"
import AuthRouter from "./routes/auth"
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"

const routes = router({
  config: ConfigRouter,
  product: ProductRouter,
  auth: AuthRouter,
})

export type Router = typeof routes

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyResultV2> => {
  // API Gateway V2 uses requestContext.http.method instead of httpMethod
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: "",
    };
  }

  // Convert API Gateway V2 event to v1 format for tRPC compatibility
  const v1Event = {
    ...event,
    httpMethod: event.requestContext.http.method,
    path: event.rawPath,
    headers: event.headers || {},
    queryStringParameters: event.queryStringParameters || {},
    body: event.body || null,
    isBase64Encoded: event.isBase64Encoded || false,
  };

  // Handle tRPC request
  const result = await awsLambdaRequestHandler({
    router: routes,
    createContext: (opts) => opts,
  })(v1Event as any, context);

  // Add CORS headers to the response
  return {
    ...result,
    headers: {
      ...result.headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  };
};
