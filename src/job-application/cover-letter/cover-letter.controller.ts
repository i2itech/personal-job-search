import { BaseController } from "../../shared/base-components/base.controller";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import {
  Body,
  NetlifyFunctionHttpController,
  NetlifyHttpMethod,
} from "../../vendors/netlify/netlify-function.decorator";
import {
  GenerateCoverLetterRequest,
  GenerateCoverLetterRequestSchema,
  GenerateCoverLetterResponseSchema,
} from "../types";
import { CoverLetterService } from "./cover-letter.service";

@NetlifyFunctionHttpController({
  path: "/api/v1/cover-letter",
})
export class CoverLetterController extends BaseController {
  constructor(private readonly coverLetterService: CoverLetterService = new CoverLetterService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    description: "Generate a cover letter",
    request: {
      body: GenerateCoverLetterRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Cover letter generated successfully",
        type: HttpDtoType.JSON,
        schema: GenerateCoverLetterResponseSchema,
      },
      errors: [],
    },
  })
  public async generateCoverLetter(@Body() body: GenerateCoverLetterRequest) {
    const jobApplication = await this.coverLetterService.generate(body);
    return jobApplication;
  }
}
