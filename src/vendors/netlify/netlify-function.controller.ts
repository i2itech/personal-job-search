import { Context } from "@netlify/functions";
import { HttpMethod } from "../../shared/types/http.types";
import { getNetlifyFunctionHttpControllerMetadata, getNetlifyHttpMethodByPath } from "./decorators";
import { getFunctionPath } from "./netlify-function.utils";
import { getLogger } from "../../shared/logger.service";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const Logger = getLogger("netlify:function:controller");

export class NetlifyFunctionController {
  async handler(req: Request, context: Context) {
    Logger.info(`[API Request] ${req.method} ${new URL(req.url).pathname}`);
    const controllerMetadata = getNetlifyFunctionHttpControllerMetadata(this);
    const path = getFunctionPath(req, controllerMetadata.path);

    const httpMethod = getNetlifyHttpMethodByPath(this, path, req.method.toUpperCase() as HttpMethod);
    if (!httpMethod) {
      Logger.error(`[API Error] Method ${req.method} not implemented for path ${path}`);
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

      Logger.info(`[API Response] ${req.method} ${path} - Status: 200`);
      return response;
    } catch (error) {
      Logger.error(`[API Error] ${req.method} ${path} - ${error instanceof Error ? error.message : "Unknown error"}`);

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
