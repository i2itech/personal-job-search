import { BaseController as BaseController } from "../../app/base.controller";
import { Body, NetlifyHttpMethod } from "../../vendors/netlify/netlify-function.decorator";
import { UpsertResumeDetailsRequest } from "../types";
import { ResumeService } from "./resume.service";

export class ResumeDetailsController extends BaseController {
  constructor(private readonly resumeService: ResumeService = new ResumeService()) {
    super();
  }

  @NetlifyHttpMethod("POST")
  public async upsertResumeDetails(@Body() body: UpsertResumeDetailsRequest) {
    return this.resumeService.upsertResumeDetails(body);
  }
}
