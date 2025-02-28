import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { NetlifyFunctionOpenApiService } from "../../vendors/netlify/netlify-function-open-api.service";
import { APP_CONTROLLERS } from "../app.module";
import appConfig from "../config";

export class OpenApiService {
  constructor(
    private readonly netlifyFunctionOpenApiService: NetlifyFunctionOpenApiService = new NetlifyFunctionOpenApiService()
  ) {}

  getSchema() {
    const definitions = this.netlifyFunctionOpenApiService.getOpenApiDefinitions(APP_CONTROLLERS);

    const generator = new OpenApiGeneratorV3(definitions);
    return generator.generateDocument({
      openapi: "3.1.0",
      info: {
        title: "Job Application API",
        version: "1.0.0",
      },
      servers: [
        {
          url: appConfig().app.server_base_url,
        },
      ],
    });
  }
}
