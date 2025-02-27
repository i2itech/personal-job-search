import { BaseController as BaseController } from "../../shared/base-components/base.controller";
import { Body, NetlifyHttpMethod } from "../../vendors/netlify/netlify-function.decorator";
import { GenerateCoverLetterRequest } from "../types";
import { CoverLetterService } from "./cover-letter.service";

// @NetlifyFunction({
//   path: "/api/v1/cover-letter",
// })
export class CoverLetterController extends BaseController {
  constructor(private readonly coverLetterService: CoverLetterService = new CoverLetterService()) {
    super();
  }

  @NetlifyHttpMethod("POST")
  public async generateCoverLetter(@Body() body: GenerateCoverLetterRequest) {
    const jobApplication = await this.coverLetterService.generate(body);
    return jobApplication;
  }
}
