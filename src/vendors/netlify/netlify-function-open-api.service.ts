import { OpenAPIRegistry, RouteConfig, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { RouteParameter } from "@asteasolutions/zod-to-openapi/dist/openapi-registry";
import { z } from "zod";
import { HttpDtoType, HttpMethod } from "../../shared/types/http.types";
import { getNetlifyFunctionHttpControllerMetadata, getNetlifyHttpMethod } from "./decorators";
import { NetlifyFunctionController } from "./netlify-function.controller";
import { BodyRequest, NetlifyHttpMethodResponse, OpenApiRegisterPathModel, QueryRequest } from "./netlify.types";

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
            request: this.mapQueryRequest(controller.request),
            responses: this.mapResponses([controller.responses.success, ...controller.responses.errors]),
          });
          break;
        case HttpMethod.POST:
        case HttpMethod.PUT:
        case HttpMethod.PATCH:
          registry.registerPath({
            ...sharedProps,
            request: this.mapBodyRequest(controller.request),
            responses: this.mapResponses([controller.responses.success, ...controller.responses.errors]),
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

      const prototype = controller.prototype as any;
      const propertNames = Object.getOwnPropertyNames(prototype);
      const publicFunctions = propertNames.filter(
        (property) => property !== "constructor" && typeof prototype[property] === "function"
      );

      for (const functionName of publicFunctions) {
        const httpMethod = getNetlifyHttpMethod(controller, functionName);
        if (!httpMethod) {
          continue;
        }

        let path = `${controllerMetadata.path}${httpMethod.metadata.path ? `${httpMethod.metadata.path}` : ""}`;
        path = path.replace(/:([^/]+)/g, "{$1}");
        const id = `${path}-${httpMethod.metadata.method}`;

        metadata.push({
          ...httpMethod.metadata,
          id: id,
          path: path,
        });
      }
    }

    return metadata;
  }

  mapResponse(response: NetlifyHttpMethodResponse) {
    return {
      [response.statusCode]: {
        description: response.description,
        content: { [response.type]: { schema: response.schema } },
      },
    };
  }

  mapResponses(responses: NetlifyHttpMethodResponse[]) {
    const responseMap = responses.map((response) => this.mapResponse(response));
    return Object.assign({}, ...responseMap);
  }

  mapBodyRequest(request: BodyRequest) {
    const params = request.params as RouteParameter;

    let body = undefined;
    if (request.body && "type" in request.body && "schema" in request.body) {
      const schema = request.body.schema;
      const type = request.body.type || HttpDtoType.JSON;
      body = { content: { [type]: { schema } } };
    } else if (request.body) {
      const schema = request.body;
      const type = HttpDtoType.JSON;
      body = { content: { [type]: { schema } } };
    }

    return { params, body };
  }

  mapQueryRequest(request: QueryRequest) {
    if (!request || !(request.params || request.query)) {
      return undefined;
    }
    const params = request.params as RouteParameter;
    const query = request.query as RouteParameter;
    return { params, query };
  }
}
