import { Context } from "@netlify/functions";
import "reflect-metadata";
import { HttpMethod } from "../../shared/types/http.types";
import { NetlifyFunctionController } from "./netlify-function.controller";
import { getFunctionBody, getFunctionParams } from "./netlify-function.utils";
import {
  NetlifyHttpControllerMetadata,
  NetlifyHttpMethodMetadata,
  NetlifyHttpMethods,
  NetlifyHttpMethod,
} from "./netlify.types";

// Define metadata keys as symbols
const FUNCTION_HTTP_CONTROLLER_KEY = Symbol("netlify:httpController");
const PARAMS_METADATA_KEY = Symbol("netlify:params");
const HTTP_METHODS_METADATA_KEY = Symbol("netlify:httpMethods");

export function NetlifyFunctionHttpController(metadata: NetlifyHttpControllerMetadata): ClassDecorator {
  return function (target: Object) {
    Reflect.defineMetadata(FUNCTION_HTTP_CONTROLLER_KEY, metadata, target);
  };
}

export function getNetlifyFunctionHttpControllerMetadata(target: Object): NetlifyHttpControllerMetadata {
  const metadata = Reflect.getMetadata(FUNCTION_HTTP_CONTROLLER_KEY, target);
  if (!metadata) {
    throw new Error(`No Netlify function http controller metadata found for ${target.constructor.name}`);
  }
  return metadata;
}

export function NetlifyHttpMethod<T extends HttpMethod>(metadata: NetlifyHttpMethodMetadata<T>): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol | undefined, descriptor: PropertyDescriptor) {
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }

    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, context: Context) {
      const instance = new (target.constructor as any)();
      const params = Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey.toString()) || [];

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
    const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller.prototype) || {};
    httpMethods[metadata.method] = { handler: descriptor.value, metadata };
    Reflect.defineMetadata(HTTP_METHODS_METADATA_KEY, httpMethods, controller.prototype);

    return descriptor;
  };
}

export function getNetlifyHttpMethod(target: Object, method: HttpMethod): NetlifyHttpMethod | undefined {
  const controller = target.constructor as typeof NetlifyFunctionController;
  const httpMethods: NetlifyHttpMethods = Reflect.getMetadata(HTTP_METHODS_METADATA_KEY, controller.prototype) || {};
  return httpMethods[method];
}

export function Params(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }
    const existingParams = Reflect.getMetadata("params", target, propertyKey) || [];
    existingParams[parameterIndex] = "params";
    Reflect.defineMetadata("params", existingParams, target, propertyKey);
  };
}

export function Body(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }
    const existingParams = Reflect.getMetadata("params", target, propertyKey) || [];
    existingParams[parameterIndex] = "body";
    Reflect.defineMetadata("params", existingParams, target, propertyKey);
  };
}

// export const Query = (): ParameterDecorator => {
//   return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
//     Reflect.defineMetadata(
//       `param:${parameterIndex}`,
//       'query',
//       target,
//       propertyKey
//     );
//   };
// };
