import { NetlifyHttpControllerMetadata } from "../netlify.types";

const FUNCTION_HTTP_CONTROLLER_KEY = Symbol("netlify:httpController");

export function NetlifyFunctionHttpController(metadata: NetlifyHttpControllerMetadata): ClassDecorator {
  return function (target: Object) {
    Reflect.defineMetadata(FUNCTION_HTTP_CONTROLLER_KEY, metadata, target);
  };
}

export function getNetlifyFunctionHttpControllerMetadata(target: Object): NetlifyHttpControllerMetadata {
  const metadata = Reflect.getMetadata(FUNCTION_HTTP_CONTROLLER_KEY, target);
  if (!metadata) {
    const targetName = (target as Function).name;
    throw new Error(`No Netlify function http controller metadata found for ${targetName}`);
  }
  return metadata;
}
