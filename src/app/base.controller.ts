import { NetlifyFunctionController } from "../vendors/netlify/netlify-function.controller";

export abstract class BaseController extends NetlifyFunctionController {
  constructor() {
    super();
  }
}
