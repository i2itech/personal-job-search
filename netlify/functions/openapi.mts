import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Config, Context } from "@netlify/functions";
import { z } from "zod";
import { JobApplicationService } from "../../src/job-application/job-application.service";
import {
  GenerateCoverLetterRequestSchema,
  GenerateCoverLetterResponseSchema,
  GenerateResumeRequestSchema,
  GenerateResumeResponseSchema,
  CreateJobApplicationRequest,
  CreateJobApplicationRequestSchema,
  CreateJobApplicationResponseSchema,
  GetJobApplicationResponseSchema,
} from "../../src/job-application/types";
import appConfig from "../../src/app/config";

extendZodWithOpenApi(z);

export const config: Config = {
  path: "/api/v1/openapi.json",
};

const generateOpenApi = () => {
  // Create registry instance
  const registry = new OpenAPIRegistry();

  // Define API paths
  registry.registerPath({
    method: "post",
    operationId: "createJobApplication",
    path: "/api/v1/job-application",
    description: "Create a new job application",
    request: {
      body: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateJobApplicationRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Job application created successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateJobApplicationResponse" },
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    operationId: "generateResume",
    path: "/api/v1/job-application/resume",
    description: "Generate a resume for a job application",
    request: {
      body: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenerateResumeRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Job application imported successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenerateResumeResponse" },
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    operationId: "generateCoverLetter",
    path: "/api/v1/job-application/cover-letter",
    description: "Generate a cover letter for a job application",
    request: {
      body: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenerateCoverLetterRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Cover letter generated successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenerateCoverLetterResponse" },
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    operationId: "getJobApplication",
    path: "/api/v1/job-application/{id}",
    description: "Get a job application by ID",
    request: {
      params: z.object({
        id: z.string().openapi({
          description: "The ID of the job application",
          example: "123e4567-e89b-12d3-a456-426614174000 or 123e4567e89b12d3a456426614174000",
        }),
      }),
    },
    responses: {
      200: {
        description: "Job application imported successfully",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GetJobApplicationResponse" },
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });
  // Register your schemas
  registry.register("CreateJobApplicationRequest", CreateJobApplicationRequestSchema);
  registry.register("GenerateResumeRequest", GenerateResumeRequestSchema);
  registry.register("GenerateCoverLetterRequest", GenerateCoverLetterRequestSchema);
  registry.register("CreateJobApplicationResponse", CreateJobApplicationResponseSchema);
  registry.register("GenerateResumeResponse", GenerateResumeResponseSchema);
  registry.register("GenerateCoverLetterResponse", GenerateCoverLetterResponseSchema);
  registry.register("GetJobApplicationResponse", GetJobApplicationResponseSchema);

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Job Application API",
      version: "1.0.0",
    },
    servers: [
      {
        url: appConfig.app.server_base_url,
      },
    ],
  });
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "GET": {
      const openApi = generateOpenApi();
      return new Response(JSON.stringify(openApi), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};
