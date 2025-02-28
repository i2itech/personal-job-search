import { Context } from "@netlify/functions";
import { HttpMethod } from "../../../shared/types/http.types";
import { NetlifyFunctionController } from "../netlify-function.controller";
import { getFunctionBody, getFunctionParams } from "../netlify-function.utils";
import { NetlifyHttpMethod, NetlifyHttpMethodMetadata, NetlifyHttpMethods } from "../netlify.types";
import { getParams } from "./function-http-method-params.decorator";

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
    const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller) || {};
    httpMethods[propertyKey.toString()] = { handler: descriptor.value, metadata };
    httpMethods[metadata.method] = { handler: descriptor.value, metadata };
    Reflect.defineMetadata(HTTP_METHODS_METADATA_KEY, httpMethods, controller);

    return descriptor;
  };
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

export function getNetlifyHttpMethodByMethod(target: Object, method: HttpMethod): NetlifyHttpMethod | undefined {
  let controller: typeof NetlifyFunctionController | undefined;
  if (target instanceof NetlifyFunctionController) {
    controller = target.constructor as typeof NetlifyFunctionController;
  }

  controller = controller || (target as typeof NetlifyFunctionController);

  const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller) || {};
  return httpMethods[method];
}
