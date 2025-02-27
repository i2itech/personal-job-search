import { NetlifyFunctionOpenApiService } from "../../vendors/netlify/netlify-function-open-api.service";

export class OpenApiService {
  constructor(
    private readonly netlifyFunctionOpenApiService: NetlifyFunctionOpenApiService = new NetlifyFunctionOpenApiService()
  ) {}

  getSchema() {
    return this.netlifyFunctionOpenApiService.getOpenApiSchema();
  }
}
