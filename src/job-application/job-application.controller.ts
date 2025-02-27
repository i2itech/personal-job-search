import { BaseController as BaseController } from "../shared/base-components/base.controller";
import { Body, NetlifyHttpMethod, Params } from "../vendors/netlify/netlify-function.decorator";
import { JobApplicationService } from "./job-application.service";
import { CreateJobApplicationRequest } from "./types";

export class JobApplicationController extends BaseController {
  constructor(private readonly jobApplicationService: JobApplicationService = new JobApplicationService()) {
    super();
  }

  @NetlifyHttpMethod("POST")
  public async create(@Body() body: CreateJobApplicationRequest) {
    const jobApplication = await this.jobApplicationService.create(body);
    return {
      message: "Application submitted successfully",
      job_application: jobApplication,
    };
  }
}
