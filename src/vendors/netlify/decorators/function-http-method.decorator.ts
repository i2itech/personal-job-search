import { Context } from "@netlify/functions";
import { HttpMethod } from "../../../shared/types/http.types";
import { NetlifyFunctionController } from "../netlify-function.controller";
import { getFunctionBody, getFunctionParams, getUrlMatchingRegex } from "../netlify-function.utils";
import { NetlifyHttpMethod, NetlifyHttpMethodMetadata, NetlifyHttpMethods } from "../netlify.types";
import { getParams } from "./function-http-method-params.decorator";
import { getNetlifyFunctionHttpControllerMetadata, setFunctionMetadata } from "./function-http-controller.decorator";

const HTTP_METHODS_METADATA_KEY = Symbol("netlify:httpMethods");

export function NetlifyHttpMethod(metadata: NetlifyHttpMethodMetadata): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol | undefined, descriptor: PropertyDescriptor) {
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, context: Context) {
      const instance = new (target.constructor as any)();
      const params = getParams(target, propertyKey) || [];

      const args = await Promise.all(
        params.map(async (type: string) => {
          switch (type) {
            case "params":
              return getFunctionParams(context);
            case "body":
              return getFunctionBody(req);
            default:
              return undefined;
          }
        })
      );

      return originalMethod.apply(instance, args);
    };

    // Store using symbol-based metadata key
    const controller = target.constructor as typeof NetlifyFunctionController;
    setFunctionMetadata(controller, propertyKey.toString(), metadata);

    const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller) || {};
    const methodKey = getMethodKey(metadata);
    httpMethods[methodKey] = { handler: descriptor.value, metadata };
    Reflect.defineMetadata(HTTP_METHODS_METADATA_KEY, httpMethods, controller);

    return descriptor;
  };
}

function getMethodKey(metadata: { path?: string; method: HttpMethod }) {
  if (!!metadata.path && metadata.path !== "/") {
    return `${metadata.path}-${metadata.method}`;
  }
  return metadata.method;
}

export function getNetlifyHttpMethodByFunction(target: Object, functionName: string): NetlifyHttpMethod | undefined {
  let controller: typeof NetlifyFunctionController | undefined;
  if (target instanceof NetlifyFunctionController) {
    controller = target.constructor as typeof NetlifyFunctionController;
  }

  controller = controller || (target as typeof NetlifyFunctionController);

  const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller) || {};
  return httpMethods[functionName];
}

export function getNetlifyHttpMethodByPath(
  target: Object,
  path: string,
  method: HttpMethod
): NetlifyHttpMethod | undefined {
  let controller: typeof NetlifyFunctionController | undefined;
  if (target instanceof NetlifyFunctionController) {
    controller = target.constructor as typeof NetlifyFunctionController;
  }

  controller = controller || (target as typeof NetlifyFunctionController);

  const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller) || {};
  const incomingMethodKey = getMethodKey({ path, method });
  for (const existingMethodKey in httpMethods) {
    const pathRegex = getUrlMatchingRegex(existingMethodKey);
    if (pathRegex.test(incomingMethodKey)) {
      return httpMethods[existingMethodKey];
    }
  }
  return undefined;
}
