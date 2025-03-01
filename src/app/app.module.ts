import { ClassConstructor } from "class-transformer";
import CoverLetterController from "../job-application/cover-letter/cover-letter.controller";
import JobApplicationController from "../job-application/job-application.controller";
import ResumeController from "../job-application/resume/resume.controller";
import { BaseController } from "../shared/base-components/base.controller";
import OpenApiController from "./open-api/open-api.controller";

export const APP_CONTROLLERS: ClassConstructor<BaseController>[] = [
  JobApplicationController,
  ResumeController,
  CoverLetterController,
];

export const ALL_CONTROLLERS: ClassConstructor<BaseController>[] = [...APP_CONTROLLERS, OpenApiController];
