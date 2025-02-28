import { Context } from "@netlify/functions";
import { HttpMethod } from "../../shared/types/http.types";
import { getNetlifyHttpMethodByMethod } from "./decorators";

export class NetlifyFunctionController {
  httpMethods: Record<HttpMethod, (...args: any) => Promise<any>>;

  async handler(req: Request, context: Context) {
    const method = req.method as HttpMethod;
    const httpMethod = getNetlifyHttpMethodByMethod(this, method);
    if (!httpMethod) {
      throw new Error(`Method ${method} not implemented`);
    }
    const handler = httpMethod.handler;

    try {
      const result = await handler(req, context);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error in NetlifyFunctionController:", error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "An unknown error occurred",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
