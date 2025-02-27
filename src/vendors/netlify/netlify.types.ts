import { Context } from "@netlify/functions";
import { z } from "zod";
import { HttpMethod, HttpDtoType, HttpStatusCode } from "../../shared/types/http.types";

// Decorator metadata types
export interface NetlifyHttpControllerMetadata {
  path: string;
}

type QueryRequest = {
  params?: z.ZodSchema;
  query?: z.ZodSchema;
};

type BodyRequest = {
  params?: z.ZodSchema;
  body?:
    | {
        type: HttpDtoType;
        schema: z.ZodSchema;
      }
    | z.ZodSchema;
};

export type NetlifyHttpMethodRequest = {
  [HttpMethod.GET]: QueryRequest;
  [HttpMethod.POST]: BodyRequest;
  [HttpMethod.PUT]: BodyRequest;
  [HttpMethod.PATCH]: BodyRequest;
  [HttpMethod.DELETE]: QueryRequest;
};

export interface NetlifyHttpMethodResponse {
  statusCode: HttpStatusCode;
  description: string;
  type: HttpDtoType;
  schema: z.ZodSchema;
}

export interface NetlifyHttpMethodMetadata<T extends HttpMethod> {
  method: T;
  path?: string;
  description: string;
  request: NetlifyHttpMethodRequest[T];
  responses: {
    success: NetlifyHttpMethodResponse;
    errors: NetlifyHttpMethodResponse[];
  };
}

// Decorator Behind the scenes
type NetlifyHttpMethodHandler = (req: Request, context: Context) => Promise<any>;
export type NetlifyHttpMethod = {
  handler: NetlifyHttpMethodHandler;
  metadata: NetlifyHttpMethodMetadata<HttpMethod>;
};

export type NetlifyHttpMethods = Record<HttpMethod, NetlifyHttpMethod>;

export enum NetlifyHttpMethodParamType {
  PARAMS = "params",
  BODY = "body",
  QUERY = "query",
  HEADER = "headers",
}
