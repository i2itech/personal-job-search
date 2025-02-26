import { BaseController } from "./base.controller";
import { OpenApiService } from "./open-api.service";
import { NetlifyHttpMethod } from "../vendors/netlify/netlify-function.decorator";
export class OpenApiController extends BaseController {
  constructor(private readonly openApiService: OpenApiService = new OpenApiService()) {
    super();
  }

  @NetlifyHttpMethod("GET")
  getSchema() {
    return this.openApiService.getSchema();
  }
}
