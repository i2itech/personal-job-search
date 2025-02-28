import { Config, Context } from "@netlify/functions";
import { ResumeController } from "../../src/job-application/resume/resume.controller";

export const config: Config = {
  path: "/api/v1/resume",
};

export default async (req: Request, context: Context) => {
  return new ResumeController().handler(req, context);
};
