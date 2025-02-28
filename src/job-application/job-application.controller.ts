import { z } from "zod";
import { BaseController } from "../shared/base-components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod, Params } from "../vendors/netlify/decorators";
import { JobApplicationService } from "./job-application.service";
import {
  CreateJobApplicationRequest,
  CreateJobApplicationRequestSchema,
  CreateJobApplicationResponseSchema,
  GetJobApplicationResponseSchema,
  UpdateJobApplicationRequest,
  UpdateJobApplicationRequestSchema,
  UpdateJobApplicationResponseSchema,
} from "./types";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ErrorResponseSchema } from "../shared/types/common.types";

extendZodWithOpenApi(z);

export const JobApplicationIdParamSchema = z.object({ id: z.string() }).openapi("JobApplicationIdParam");

@NetlifyFunctionHttpController({
  path: "/api/v1/job-application",
  description: "Job application API",
})
export default class JobApplicationController extends BaseController {
  constructor(private readonly jobApplicationService: JobApplicationService = new JobApplicationService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    description: "Create a new job application",
    request: {
      body: CreateJobApplicationRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.CREATED,
        description: "Job application created successfully",
        type: HttpDtoType.JSON,
        schema: CreateJobApplicationResponseSchema,
      },
      errors: [
        {
          statusCode: HttpStatusCode.BAD_REQUEST,
          description: "Bad request",
          type: HttpDtoType.JSON,
          schema: ErrorResponseSchema,
        },
      ],
    },
  })
  public async create(@Body() body: CreateJobApplicationRequest) {
    const jobApplication = await this.jobApplicationService.create(body);
    return {
      message: "Application submitted successfully",
      job_application: jobApplication,
    };
  }

  @NetlifyHttpMethod({
    method: HttpMethod.GET,
    description: "Get a job application by id",
    path: "/:id",
    request: {
      params: JobApplicationIdParamSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Job application found",
        type: HttpDtoType.JSON,
        schema: GetJobApplicationResponseSchema,
      },
      errors: [
        {
          statusCode: HttpStatusCode.NOT_FOUND,
          description: "Job application not found",
          type: HttpDtoType.JSON,
          schema: ErrorResponseSchema,
        },
      ],
    },
  })
  public async getJobApplicationId(@Params() params: { id: string }) {
    return this.jobApplicationService.findById(params.id);
  }

  @NetlifyHttpMethod({
    method: HttpMethod.PATCH,
    description: "Update a job application by id",
    path: "/:id",
    request: {
      params: JobApplicationIdParamSchema,
      body: UpdateJobApplicationRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Job application updated",
        type: HttpDtoType.JSON,
        schema: UpdateJobApplicationResponseSchema,
      },
      errors: [
        {
          statusCode: HttpStatusCode.NOT_FOUND,
          description: "Job application not found",
          type: HttpDtoType.JSON,
          schema: ErrorResponseSchema,
        },
      ],
    },
  })
  public async updateJobApplication(@Params() params: { id: string }, @Body() body: UpdateJobApplicationRequest) {
    return await this.jobApplicationService.update(params.id, body);
  }
}
