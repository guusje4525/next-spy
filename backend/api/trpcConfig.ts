import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda"
import router from "./router"
import ProductRouter from './routes/product'

const routes = router.router({
  product: ProductRouter
})

export type Router = typeof routes

export const handler = async (event: any, context: any) => {
  // Check for OPTIONS method (preflight request) and handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      },
      body: '',
    };
  }

  // Proceed with your normal tRPC handler
  const result = await awsLambdaRequestHandler({
    router: routes,
    createContext: (opts) => opts,
  })(event, context);

  // Add CORS headers to the tRPC response
  return result
}