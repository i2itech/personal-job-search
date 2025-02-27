import { z } from "zod";

interface OpenApiRegisterPathModel {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  request: {
    body?: {
      type: "application/json" | "application/pdf";
      schema: z.ZodSchema;
    };
  };
  responses: {
    description: string;
    type: "application/json" | "application/pdf";
    schema: z.ZodSchema;
  }[];
}
