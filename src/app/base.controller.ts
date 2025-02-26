import "./bootstrap";
import { useDB } from "../vendors/mongodb/db-connection";
import { NetlifyFunctionController } from "../vendors/netlify/netlify-function.controller";

export abstract class BaseController extends NetlifyFunctionController {
  constructor() {
    super();
  }

  async handler(req: any, context: any): Promise<Response> {
    return await useDB(async () => {
      return await super.handler(req, context);
    });
  }
}
