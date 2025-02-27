import { BaseController as BaseController } from "../shared/base-components/base.controller";
import { Body, NetlifyHttpMethod, Params } from "../vendors/netlify/netlify-function.decorator";
import { JobApplicationService } from "./job-application.service";
import { UpdateJobApplicationRequest } from "./types";

export class JobApplicationIdController extends BaseController {
  constructor(private readonly jobApplicationService: JobApplicationService = new JobApplicationService()) {
    super();
  }

  @NetlifyHttpMethod("GET")
  public async getJobApplicationId(@Params() params: { id: string }) {
    return this.jobApplicationService.findById(params.id);
  }

  @NetlifyHttpMethod("PATCH")
  public async updateJobApplication(@Params() params: { id: string }, @Body() body: UpdateJobApplicationRequest) {
    return this.jobApplicationService.update(params.id, body);
  }
}
