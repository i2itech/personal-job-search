import { BaseFunction as BaseController } from "../../app/base.function";
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
  private async generateCoverLetter(@Body() body: GenerateCoverLetterRequest) {
    try {
      const jobApplication = await this.coverLetterService.generate(body);

      return new Response(
        JSON.stringify({
          message: "Cover letter generated successfully and job application updated",
          job_application: jobApplication,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error processing job application:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to process application",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
