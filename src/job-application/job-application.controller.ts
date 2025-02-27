import { BaseController as BaseController } from "../shared/base-components/base.controller";
import { HttpMethod } from "../shared/types/http.types";
import { HttpDtoType } from "../shared/types/http.types";
import { HttpStatusCode } from "../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod, Params } from "../vendors/netlify/decorators";
import { JobApplicationService } from "./job-application.service";
import {
  CreateJobApplicationRequest,
  CreateJobApplicationRequestSchema,
  CreateJobApplicationResponseSchema,
} from "./types";

@NetlifyFunctionHttpController({
  path: "/api/v1/job-application",
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
}
