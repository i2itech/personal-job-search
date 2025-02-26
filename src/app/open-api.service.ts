import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateJobApplicationResponseSchema,
  GenerateCoverLetterRequestSchema,
  GenerateCoverLetterResponseSchema,
  GenerateResumeRequestSchema,
  GenerateResumeResponseSchema,
  GetJobApplicationResponseSchema,
  UpsertResumeDetailsRequestSchema,
  UpsertResumeDetailsResponseSchema,
} from "../job-application/types";
import { CreateJobApplicationRequestSchema } from "../job-application/types";
import appConfig from "./config";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export class OpenApiService {
  constructor() {}

  getSchema() {
    return this.getAPISchema();
  }

  getAPISchema() {
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
              schema: CreateJobApplicationRequestSchema.openapi("CreateJobApplicationRequest"),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Job application created successfully",
          content: {
            "application/json": {
              schema: CreateJobApplicationResponseSchema.openapi("CreateJobApplicationResponse"),
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
      path: "/api/v1/resume/generate",
      description: "Generate the resume for a job application",
      request: {
        body: {
          content: {
            "application/json": {
              schema: GenerateResumeRequestSchema.openapi("GenerateResumeRequest"),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Job application imported successfully",
          content: {
            "application/json": {
              schema: GenerateResumeResponseSchema.openapi("GenerateResumeResponse"),
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
      path: "/api/v1/cover-letter",
      description: "Generate a cover letter for a job application",
      request: {
        body: {
          content: {
            "application/json": {
              schema: GenerateCoverLetterRequestSchema.openapi("GenerateCoverLetterRequest"),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cover letter generated successfully",
          content: {
            "application/json": {
              schema: GenerateCoverLetterResponseSchema.openapi("GenerateCoverLetterResponse"),
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
              schema: GetJobApplicationResponseSchema.openapi("GetJobApplicationResponse"),
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
      operationId: "upsertResumeDetails",
      path: "/api/v1/resume",
      description: "Update the resume details for a job application",
      request: {
        body: {
          content: {
            "application/json": {
              schema: UpsertResumeDetailsRequestSchema.openapi("UpsertResumeDetailsRequest"),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Resume details updated successfully",
          content: {
            "application/json": {
              schema: UpsertResumeDetailsResponseSchema.openapi("UpsertResumeDetailsResponse"),
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

    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
      openapi: "3.1.0",
      info: {
        title: "Job Application API",
        version: "1.0.0",
      },
      servers: [
        {
          url: appConfig().app.server_base_url,
        },
      ],
    });
  }
}
