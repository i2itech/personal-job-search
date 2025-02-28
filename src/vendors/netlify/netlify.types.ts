import { Context } from "@netlify/functions";
import { z } from "zod";
import { HttpMethod, HttpDtoType, HttpStatusCode } from "../../shared/types/http.types";

export type OpenApiRegisterPathModel = NetlifyHttpMethodMetadata & {
  id: string;
  path: string;
};

// Decorator metadata types
export interface NetlifyHttpControllerMetadata {
  path: string;
}

export type QueryRequest = {
  params?: z.ZodSchema;
  query?: z.ZodSchema;
};

export type BodyRequest = {
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

export type NetlifyHttpMethodMetadata =
  | {
      method: HttpMethod.GET | HttpMethod.DELETE;
      path?: string;
      description: string;
      request: QueryRequest;
      responses: {
        success: NetlifyHttpMethodResponse;
        errors: NetlifyHttpMethodResponse[];
      };
    }
  | {
      method: HttpMethod.POST | HttpMethod.PUT | HttpMethod.PATCH;
      description: string;
      request: BodyRequest;
      responses: {
        success: NetlifyHttpMethodResponse;
        errors: NetlifyHttpMethodResponse[];
      };
    };

// Decorator Behind the scenes
type NetlifyHttpMethodHandler = (req: Request, context: Context) => Promise<any>;
export type NetlifyHttpMethod = {
  handler: NetlifyHttpMethodHandler;
  metadata: NetlifyHttpMethodMetadata;
};

/* Store the methods for each decorated function of the controller, string is the function name */
export type NetlifyHttpMethods = Record<string, NetlifyHttpMethod>;

export enum NetlifyHttpMethodParamType {
  PARAMS = "params",
  BODY = "body",
  QUERY = "query",
  HEADER = "headers",
}
