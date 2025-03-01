import { Context } from "@netlify/functions";
import { HttpMethod } from "../../shared/types/http.types";
import { getNetlifyFunctionHttpControllerMetadata, getNetlifyHttpMethodByPath } from "./decorators";
import { getFunctionPath } from "./netlify-function.utils";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

export class NetlifyFunctionController {
  async handler(req: Request, context: Context) {
    const controllerMetadata = getNetlifyFunctionHttpControllerMetadata(this);
    const path = getFunctionPath(req, controllerMetadata.path);

    console.log(`[API Request] ${req.method} ${path}`);

    const httpMethod = getNetlifyHttpMethodByPath(this, path, req.method.toUpperCase() as HttpMethod);
    if (!httpMethod) {
      console.log(`[API Error] Method ${req.method} not implemented for path ${path}`);
      return new Response(JSON.stringify({ error: `Method ${req.method} not implemented` }), {
        status: 405,
        headers: { ...DEFAULT_HEADERS },
      });
    }

    try {
      const result = await httpMethod.handler(req, context);
      const response = new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...DEFAULT_HEADERS,
        },
      });

      console.log(`[API Response] ${req.method} ${path} - Status: 200`);
      return response;
    } catch (error) {
      console.error(`[API Error] ${req.method} ${path} - ${error instanceof Error ? error.message : "Unknown error"}`);

      const status = error instanceof Error && "status" in error ? (error.status as number) : 500;

      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "An unknown error occurred",
        }),
        {
          status,
          headers: { ...DEFAULT_HEADERS },
        }
      );
    }
  }
}
