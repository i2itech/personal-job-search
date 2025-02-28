import { NetlifyFunctionController } from "../netlify-function.controller";
import { NetlifyHttpControllerMetadata, NetlifyHttpMethodMetadata } from "../netlify.types";

const FUNCTION_HTTP_CONTROLLER_KEY = Symbol("netlify:httpController");

export function NetlifyFunctionHttpController(metadata: NetlifyHttpControllerMetadata): ClassDecorator {
  return function (target: Object) {
    let controllerMetadata = Reflect.getMetadata(FUNCTION_HTTP_CONTROLLER_KEY, target) || {};
    controllerMetadata = {
      ...controllerMetadata,
      ...metadata,
    };
    Reflect.defineMetadata(FUNCTION_HTTP_CONTROLLER_KEY, controllerMetadata, target);
  };
}

export function getNetlifyFunctionHttpControllerMetadata(target: Object): NetlifyHttpControllerMetadata {
  let controller: typeof NetlifyFunctionController | undefined;
  if (target instanceof NetlifyFunctionController) {
    console.log("target is NetlifyFunctionController", target.constructor.prototype);
    controller = target.constructor as typeof NetlifyFunctionController;
  }
  controller = controller || (target as typeof NetlifyFunctionController);
  const metadata = Reflect.getMetadata(FUNCTION_HTTP_CONTROLLER_KEY, controller);
  console.log("metadata", metadata);
  if (!metadata) {
    const targetName = (target as Function).name;
    throw new Error(`No Netlify function http controller metadata found for ${targetName}`);
  }
  return metadata;
}

export function setFunctionMetadata(target: Object, functionName: string, metadata: NetlifyHttpMethodMetadata) {
  const controllerMetadata = Reflect.getMetadata(FUNCTION_HTTP_CONTROLLER_KEY, target) || {};
  controllerMetadata.httpMethodFunctions = {
    ...controllerMetadata.httpMethodFunctions,
    [functionName]: metadata,
  };
  Reflect.defineMetadata(FUNCTION_HTTP_CONTROLLER_KEY, controllerMetadata, target);
}
