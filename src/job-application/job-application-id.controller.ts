import { z } from "zod";
import { HttpMethod } from "../shared/types/http.types";
import { BaseController as BaseController } from "../shared/base-components/base.controller";
import { HttpStatusCode } from "../shared/types/http.types";
import { HttpDtoType } from "../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod, Params } from "../vendors/netlify/decorators";
import { JobApplicationService } from "./job-application.service";
import {
  GetJobApplicationResponseSchema,
  UpdateJobApplicationRequest,
  UpdateJobApplicationRequestSchema,
  UpdateJobApplicationResponseSchema,
} from "./types";

@NetlifyFunctionHttpController({
  path: "/job-application/{id}",
})
export class JobApplicationIdController extends BaseController {
  constructor(private readonly jobApplicationService: JobApplicationService = new JobApplicationService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.GET,
    description: "Get a job application by id",
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
