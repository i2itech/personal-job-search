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
    return handler(req, context);
  }
}
