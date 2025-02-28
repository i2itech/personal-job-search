import { OpenAPIRegistry, RouteConfig, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { RouteParameter } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import { z } from "zod";
import { HttpDtoType, HttpMethod } from "../../shared/types/http.types";
import { getNetlifyFunctionHttpControllerMetadata } from "./decorators";
import { NetlifyFunctionController } from "./netlify-function.controller";
import { BodyRequest, NetlifyHttpMethodResponse, OpenApiRegisterPathModel, QueryRequest } from "./netlify.types";
import { formatString } from "../../shared/utils/string.utils";
import { StringFormat } from "../../shared/utils";

extendZodWithOpenApi(z);

export class NetlifyFunctionOpenApiService {
  constructor() {}

  getOpenApiDefinitions(netlifyControllers: (typeof NetlifyFunctionController)[]) {
    // Create registry instance
    const registry = new OpenAPIRegistry();

    const controllers = this.getControllerSchemas(netlifyControllers);

    for (const controller of controllers) {
      const sharedProps = {
        operationId: controller.id,
        method: controller.method.toLowerCase() as RouteConfig["method"],
        path: controller.path as RouteConfig["path"],
        description: controller.description,
      };

      const method = controller.method as HttpMethod;
      switch (method) {
        case HttpMethod.GET:
        case HttpMethod.DELETE:
          registry.registerPath({
            ...sharedProps,
            request: this.mapQueryRequest(controller),
            responses: this.mapResponses(controller),
          });
          break;
        case HttpMethod.POST:
        case HttpMethod.PUT:
        case HttpMethod.PATCH:
          registry.registerPath({
            ...sharedProps,
            request: this.mapBodyRequest(controller),
            responses: this.mapResponses(controller),
          });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    }

    return registry.definitions;
  }

  getControllerSchemas(controllers: (typeof NetlifyFunctionController)[]): OpenApiRegisterPathModel[] {
    let metadata: OpenApiRegisterPathModel[] = [];
    for (const controller of controllers) {
      // const instance = new (controller.prototype.constructor as any)();
      const controllerMetadata = getNetlifyFunctionHttpControllerMetadata(controller);

      console.log("methodMetadata", controllerMetadata.httpMethodFunctions);
      for (const functionName in controllerMetadata.httpMethodFunctions) {
        const methodMetadata = controllerMetadata.httpMethodFunctions[functionName];
        if (!methodMetadata) {
          continue;
        }

        let path = `${controllerMetadata.path}${methodMetadata.path ? `${methodMetadata.path}` : ""}`;
        path = path.replace(/:([^/]+)/g, "{$1}").replace(/\/$/, "");

        let id = path
          .replace(/api\/v\d+\/?/g, "") // Remove "api/v{number}" pattern
          .replace(/[/-]/g, " ") // Replace both "/" and "-" with spaces
          .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters (keep letters, numbers, spaces)
          .replace(/\s+/g, " ") // Normalize spaces (remove extra spaces)
          .trim(); // Trim leading/trailing spaces
        id = `${id} ${methodMetadata.method}`;

        const name = formatString(id, StringFormat.PASCAL_CASE);

        console.log("id", id);
        metadata.push({
          ...methodMetadata,
          id,
          path,
          name,
        });
      }
    }

    return metadata;
  }

  mapResponse(response: NetlifyHttpMethodResponse, controller: OpenApiRegisterPathModel) {
    return {
      [response.statusCode]: {
        description: response.description,
        content: {
          [response.type]: { schema: response.schema.openapi(`${controller.name}Response${response.statusCode}`) },
        },
      },
    };
  }

  mapResponses(controller: OpenApiRegisterPathModel) {
    const responses = [controller.responses.success, ...controller.responses.errors];
    const responseMap = responses.map((response) => this.mapResponse(response, controller));
    return Object.assign({}, ...responseMap);
  }

  mapBodyRequest(controller: OpenApiRegisterPathModel & { request: BodyRequest }) {
    const request = controller.request;
    const params = request.params as RouteParameter;

    let body = undefined;
    if (request.body && "type" in request.body && "schema" in request.body) {
      const schema = request.body.schema.openapi(`${controller.name}Body`);
      const type = request.body.type || HttpDtoType.JSON;
      body = { content: { [type]: { schema } } };
    } else if (request.body) {
      const schema = request.body.openapi(`${controller.name}Body`);
      const type = HttpDtoType.JSON;
      body = { content: { [type]: { schema } } };
    }

    return { params: params?.openapi(`${controller.name}Params`), body };
  }

  mapQueryRequest(controller: OpenApiRegisterPathModel & { request: QueryRequest }) {
    const request = controller.request;
    if (!request || !(request.params || request.query)) {
      return undefined;
    }
    const params = request.params?.openapi(`${controller.name}Params`) as RouteParameter;
    const query = request.query?.openapi(`${controller.name}Query`) as RouteParameter;
    return { params, query };
  }
}
