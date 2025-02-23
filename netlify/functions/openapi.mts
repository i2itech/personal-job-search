import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Config, Context } from "@netlify/functions";
import { z } from "zod";
import { JobApplicationService } from "../../src/job-application/job-application.service";
import {
  GenerateCoverLetterRequestSchema,
  GenerateResumeRequestSchema,
  ImportJobApplicationRequest,
  ImportJobApplicationRequestSchema,
  ImportJobApplicationResponseSchema,
} from "../../src/job-application/types";
import appConfig from "../../src/app/config";

extendZodWithOpenApi(z);

export const config: Config = {
  path: "/api/v1/openapi.json",
};

const generateOpenApi = () => {
  // Create registry instance
  const registry = new OpenAPIRegistry();

  // Register your schemas
  registry.register("ImportJobApplicationRequest", ImportJobApplicationRequestSchema);
  registry.register("GenerateResumeRequest", GenerateResumeRequestSchema);
  registry.register("GenerateCoverLetterRequest", GenerateCoverLetterRequestSchema);
  registry.register("ImportJobApplicationResponse", ImportJobApplicationResponseSchema);
  // Define API paths
  registry.registerPath({
    method: "post",
    operationId: "importJobApplication",
    path: "/api/v1/job-application",
    description: "Import a new job application",
    request: {
      body: {
        content: {
          "application/json": {
            schema: { $ref: "/components/schemas/ImportJobApplicationRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Job application imported successfully",
        content: {
          "application/json": {
            schema: { $ref: "/components/schemas/ImportJobApplicationResponse" },
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
            schema: { $ref: "/components/schemas/GenerateResumeRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Job application imported successfully",
        content: {
          "application/pdf": {
            schema: z.object({
              type: z.string(),
              format: z.string().base64(),
            }),
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
            schema: { $ref: "/components/schemas/GenerateCoverLetterRequest" },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Job application imported successfully",
        content: {
          "application/pdf": {
            schema: z.string(),
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

const importJobApplication = async (body: ImportJobApplicationRequest) => {
  try {
    const jobApplicationService = new JobApplicationService();
    const jobApplication = await jobApplicationService.import(body);

    return new Response(
      JSON.stringify({
        message: "Application submitted successfully",
        jobApplication,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing job application:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process application",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
