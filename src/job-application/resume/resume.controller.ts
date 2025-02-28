import { BaseController } from "../../shared/base-components/base.controller";
import { ErrorResponseSchema } from "../../shared/types/common.types";
import { HttpDtoType, HttpMethod, HttpStatusCode } from "../../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod } from "../../vendors/netlify/decorators";
import {
  GenerateResumeRequest,
  GenerateResumeRequestSchema,
  GenerateResumeResponseSchema,
  UpsertResumeDetailsRequest,
  UpsertResumeDetailsRequestSchema,
  UpsertResumeDetailsResponseSchema,
} from "../types";
import { ResumeService } from "./resume.service";

@NetlifyFunctionHttpController({
  path: "/api/v1/resume",
  description: "Resume generate API",
})
export class ResumeController extends BaseController {
  constructor(private readonly resumeService: ResumeService = new ResumeService()) {
    super();
  }

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    description: "Upsert resume details",
    request: {
      body: UpsertResumeDetailsRequestSchema,
    },
    responses: {
      success: {
        statusCode: HttpStatusCode.OK,
        description: "Resume details upserted",
        type: HttpDtoType.JSON,
        schema: UpsertResumeDetailsResponseSchema,
      },
      errors: [
        {
          statusCode: HttpStatusCode.BAD_REQUEST,
          description: "Bad request",
          type: HttpDtoType.JSON,
          schema: ErrorResponseSchema,
        },
      ],
    },
  })
  public async upsertResumeDetails(@Body() body: UpsertResumeDetailsRequest) {
    return this.resumeService.upsertResumeDetails(body);
  }

  @NetlifyHttpMethod({
    method: HttpMethod.POST,
    path: "/generate",
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
      errors: [
        {
          statusCode: HttpStatusCode.BAD_REQUEST,
          description: "Bad request",
          type: HttpDtoType.JSON,
          schema: ErrorResponseSchema,
        },
      ],
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
