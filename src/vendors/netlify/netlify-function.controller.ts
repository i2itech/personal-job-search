import { Context } from "@netlify/functions";
import { HttpMethod } from "./netlify.types";

export class NetlifyFunctionController {
  httpMethods: Record<HttpMethod, (...args: any) => Promise<any>>;

  async handler(req: Request, context: Context) {
    const method = req.method as HttpMethod;
    const handler = this.httpMethods[method];
    if (!handler) {
      throw new Error(`Method ${method} not implemented`);
    }

    try {
      const result = await handler(req, context);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error processing job application:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to process application",
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
