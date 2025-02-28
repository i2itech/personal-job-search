import { Context } from "@netlify/functions";
import { HttpMethod } from "../../shared/types/http.types";
import { getNetlifyFunctionHttpControllerMetadata, getNetlifyHttpMethodByPath } from "./decorators";
import { getFunctionPath } from "./netlify-function.utils";

export class NetlifyFunctionController {
  httpMethods: Record<HttpMethod, (...args: any) => Promise<any>>;

  async handler(req: Request, context: Context) {
    const controllerMetadata = getNetlifyFunctionHttpControllerMetadata(this);

    const path = getFunctionPath(req, controllerMetadata.path);

    const httpMethod = getNetlifyHttpMethodByPath(this, path, req.method.toUpperCase() as HttpMethod);
    if (!httpMethod) {
      throw new Error(`Method ${req.method} not implemented`);
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
