import { NetlifyFunctionController } from "./netlify-function.controller";

export enum NetlifyHttpMethodParamType {
  PARAMS = "params",
  BODY = "body",
  QUERY = "query",
}

export function NetlifyHttpMethod(method: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol | undefined, descriptor: PropertyDescriptor) {
    if (propertyKey === undefined) {
      throw new Error("propertyKey cannot be undefined");
    }

    // Store the original method
    const originalMethod = descriptor.value;

    // Create a new method that will handle parameter injection
    descriptor.value = async function (...args: any[]) {
      const params = Reflect.getMetadata("params", target, propertyKey) || [];
      // Call the original method with the processed parameters
      return originalMethod.apply(this, args);
    };

    // Store the method in the httpMethods map
    (target.constructor as typeof NetlifyFunctionController).httpMethods =
      (target.constructor as typeof NetlifyFunctionController).httpMethods || {};
    (target.constructor as typeof NetlifyFunctionController).httpMethods[method] = descriptor.value;

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
