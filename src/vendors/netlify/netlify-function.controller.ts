import { Context } from "@netlify/functions";
import { HttpMethod } from "./netlify.types";

export class NetlifyFunctionController {
  httpMethods: Record<HttpMethod, (...args: any) => Promise<any>>;
  static httpMethods: any;

  async handler(req: Request, context: Context) {
    const method = req.method as HttpMethod;
    const handler = this.httpMethods[method];
    if (!handler) {
      throw new Error(`Method ${method} not implemented`);
    }
    const params = Reflect.getMetadata("params", this, method.toLowerCase()) || [];
    const args = await Promise.all(
      params.map(async (type: string) => {
        switch (type) {
          case "params":
            return this.getParams(context);
          case "body":
            return await this.getBody(req);
          default:
            return undefined;
        }
      })
    );
    return handler(...args);
  }

  getParams(context: Context) {
    return context.params;
  }

  getBody(req: Request) {
    const body = req.json();
    console.log("body", body);
    return body;
  }
}
