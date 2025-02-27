import { z } from "zod";
import { BaseController } from "../../shared/base-components/base.controller";
import { HttpMethod, HttpStatusCode, HttpDtoType } from "../../shared/types/http.types";
import { NetlifyHttpMethod, NetlifyFunctionHttpController } from "../../vendors/netlify/netlify-function.decorator";
import { OpenApiService } from "./open-api.service";

@NetlifyFunctionHttpController({
  path: "/open-api",
})
export class OpenApiController extends BaseController {
  constructor(private readonly openApiService: OpenApiService = new OpenApiService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.GET,
    description: "Get the OpenAPI schema",
    request: {},
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "The OpenAPI schema",
        type: HttpDtoType.JSON,
        schema: z.object({}),
      },
      errors: [],
    },
  })
  getSchema() {
    return this.openApiService.getSchema();
  }
}
