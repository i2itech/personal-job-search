import { ClassConstructor } from "class-transformer";
import { CoverLetterController } from "../job-application/cover-letter/cover-letter.controller";
import { JobApplicationIdController } from "../job-application/job-application-id.controller";
import { JobApplicationController } from "../job-application/job-application.controller";
import { ResumeDetailsController } from "../job-application/resume/resume-details.controller";
import { ResumeGenerateController } from "../job-application/resume/resume-generate.controller";
import { OpenApiController } from "./open-api/open-api.controller";
import { BaseController } from "../shared/base-components/base.controller";

export const APP_CONTROLLERS: ClassConstructor<BaseController>[] = [
  JobApplicationController,
  JobApplicationIdController,
  ResumeDetailsController,
  ResumeGenerateController,
  CoverLetterController,
];

export const ALL_CONTROLLERS: ClassConstructor<BaseController>[] = [...APP_CONTROLLERS, OpenApiController];
