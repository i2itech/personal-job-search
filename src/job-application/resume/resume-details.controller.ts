import { BaseController as BaseController } from "../../shared/base-components/base.controller";
import { HttpMethod, HttpStatusCode, HttpDtoType } from "../../shared/types/http.types";
import { Body, NetlifyFunctionHttpController, NetlifyHttpMethod } from "../../vendors/netlify/decorators";
import {
  UpsertResumeDetailsRequest,
  UpsertResumeDetailsRequestSchema,
  UpsertResumeDetailsResponseSchema,
} from "../types";
import { ResumeService } from "./resume.service";

@NetlifyFunctionHttpController({
  path: "/api/v1/resume-details",
  description: "Resume details API",
})
export class ResumeDetailsController extends BaseController {
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
      errors: [],
    },
  })
  public async upsertResumeDetails(@Body() body: UpsertResumeDetailsRequest) {
    return this.resumeService.upsertResumeDetails(body);
  }
}
