import { BaseController as BaseController } from "../app/base.controller";
import { NetlifyHttpMethod, Params } from "../vendors/netlify/netlify-function.decorator";
import { JobApplicationService } from "./job-application.service";

export class JobApplicationIdController extends BaseController {
  constructor(private readonly jobApplicationService: JobApplicationService = new JobApplicationService()) {
    super();
  }

  @NetlifyHttpMethod("GET")
  public async getJobApplicationId(@Params() params: { id: string }) {
    return this.jobApplicationService.findById(params.id);
  }
}
