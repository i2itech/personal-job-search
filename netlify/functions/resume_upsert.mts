import { Config, Context } from "@netlify/functions";
import { ResumeDetailsController } from "../../src/job-application/resume/resume-details.controller";

export const config: Config = {
  path: "/api/v1/resume",
};

export default async (req: Request, context: Context) => {
  return new ResumeDetailsController().handler(req, context);
};
