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

@NetlifyFunctionHttpController({
  path: "/api/v1/job-application",
  description: "Job application API",
})
export class JobApplicationController extends BaseController {
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
      errors: [],
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
      params: z.object({ id: z.string() }),
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Job application found",
        type: HttpDtoType.JSON,
        schema: GetJobApplicationResponseSchema,
      },
      errors: [],
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
      params: z.object({ id: z.string() }),
      body: UpdateJobApplicationRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Job application updated",
        type: HttpDtoType.JSON,
        schema: UpdateJobApplicationResponseSchema,
      },
      errors: [],
    },
  })
  public async updateJobApplication(@Params() params: { id: string }, @Body() body: UpdateJobApplicationRequest) {
    return this.jobApplicationService.update(params.id, body);
  }
}
