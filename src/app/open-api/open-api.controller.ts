import { z } from "zod";
import { BaseController } from "../../shared/components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import { NetlifyFunctionHttpController, NetlifyHttpMethod } from "../../vendors/netlify/decorators";
import { OpenApiService } from "./open-api.service";

@NetlifyFunctionHttpController({
  path: "/api/v1/openapi.json",
  description: "OpenAPI schema",
})
export default class OpenApiController extends BaseController {
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
