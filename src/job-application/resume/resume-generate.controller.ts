import { BaseController as BaseController } from "../../shared/base-components/base.controller";
import { Body, NetlifyHttpMethod } from "../../vendors/netlify/netlify-function.decorator";
import { GenerateResumeRequest } from "../types";
import { ResumeService } from "./resume.service";

export class ResumeGenerateController extends BaseController {
  constructor(private readonly resumeService: ResumeService = new ResumeService()) {
    super();
  }

  @NetlifyHttpMethod("POST")
  public async generateResume(@Body() body: GenerateResumeRequest) {
    const jobApplication = await this.resumeService.generateResume(body);
    return {
      message: "Resume generated successfully and job application updated",
      job_application: jobApplication,
    };
  }
}
