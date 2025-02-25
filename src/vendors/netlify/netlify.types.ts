export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const HttpMethodFunctionTypes = {
  [HttpMethod.GET]: (req: any, context: any) => Promise<any>,
  [HttpMethod.POST]: (req: any, context: any) => Promise<any>,
  [HttpMethod.PUT]: (req: any, context: any) => Promise<any>,
  [HttpMethod.DELETE]: (req: any, context: any) => Promise<any>,
};
