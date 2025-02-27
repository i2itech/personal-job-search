// Define metadata keys as symbols

export enum HttpMethodParams {
  PARAMS = "params",
  BODY = "body",
  QUERY = "query",
  HEADER = "header",
}

const PARAMS_METADATA_KEY = Symbol("netlify:params");

export function Params(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    addParams(target, propertyKey, parameterIndex, HttpMethodParams.PARAMS);
  };
}

export function Body(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    addParams(target, propertyKey, parameterIndex, HttpMethodParams.BODY);
  };
}

export const Query = (): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    addParams(target, propertyKey, parameterIndex, HttpMethodParams.QUERY);
  };
};

export const Header = (): ParameterDecorator => {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    addParams(target, propertyKey, parameterIndex, HttpMethodParams.HEADER);
  };
};

export const addParams = (
  target: any,
  propertyKey: string | symbol | undefined,
  parameterIndex: number,
  param: HttpMethodParams
) => {
  if (propertyKey === undefined) {
    throw new Error("propertyKey cannot be undefined");
  }
  const existingParams = Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};
  existingParams[parameterIndex] = param;
  Reflect.defineMetadata(PARAMS_METADATA_KEY, existingParams, target, propertyKey);
};

export const getParams = (target: any, propertyKey: string | symbol | undefined): HttpMethodParams[] => {
  if (propertyKey === undefined) {
    throw new Error("propertyKey cannot be undefined");
  }

  const params = Reflect.getMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};
  return Object.values(params);
};
