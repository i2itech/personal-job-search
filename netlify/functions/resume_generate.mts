import { Config, Context } from "@netlify/functions";
import { ResumeGenerateController } from "../../src/job-application/resume/resume-generate.controller";

export const config: Config = {
  path: "/api/v1/resume/generate",
};

export default async (req: Request, context: Context) => {
  return new ResumeGenerateController().handler(req, context);
};
