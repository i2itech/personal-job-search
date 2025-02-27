import { BaseController } from "../../shared/base-components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod } from "../../vendors/netlify/decorators";
import { GenerateResumeRequest, GenerateResumeRequestSchema, GenerateResumeResponseSchema } from "../types";
import { ResumeService } from "./resume.service";

@NetlifyFunctionHttpController({
  path: "/api/v1/resume-generate",
})
export class ResumeGenerateController extends BaseController {
  constructor(private readonly resumeService: ResumeService = new ResumeService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    description: "Generate a resume",
    request: {
      body: GenerateResumeRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Resume generated successfully",
        type: HttpDtoType.JSON,
        schema: GenerateResumeResponseSchema,
      },
      errors: [],
    },
  })
  public async generateResume(@Body() body: GenerateResumeRequest) {
    const jobApplication = await this.resumeService.generateResume(body);
    return {
      message: "Resume generated successfully and job application updated",
      job_application: jobApplication,
    };
  }
}
