import { NetlifyFunctionController } from "../vendors/netlify/netlify-function.controller";

export abstract class BaseFunction extends NetlifyFunctionController {
  constructor() {
    super();
  }
}
