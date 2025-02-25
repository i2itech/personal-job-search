import "reflect-metadata";
import { Context } from "@netlify/functions";
import { NetlifyFunctionController } from "./netlify-function.controller";
import { getFunctionBody, getFunctionParams } from "./netlify-function.utils";
import { HttpMethod } from "./netlify.types";

export enum NetlifyHttpMethodParamType {
  PARAMS = "params",
  BODY = "body",
  QUERY = "query",
}

export function NetlifyHttpMethod(method: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol | undefined, descriptor: PropertyDescriptor) {
    console.log("target", target);
    console.log("propertyKey", propertyKey);
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }

    // Store the original method
    const originalMethod = descriptor.value;

    // Create a new method that will handle parameter injection
    descriptor.value = async function (req: Request, context: Context) {
      // Create new instance of the controller
      const instance = new (target.constructor as any)();

      const params = Reflect.getMetadata("params", target, propertyKey.toString()) || [];
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

      console.log("this", target);
      // Call the method on the new instance
      return originalMethod.apply(instance, args);
    };

    // Store the method in the httpMethods map
    const controller = target.constructor as typeof NetlifyFunctionController;
    controller.prototype.httpMethods = controller.prototype.httpMethods || {};
    controller.prototype.httpMethods[method as HttpMethod] = descriptor.value;

    return descriptor;
  };
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
