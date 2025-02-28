import { Config, Context } from "@netlify/functions";
import { JobApplicationController } from "../../src/job-application/job-application.controller";

export const config: Config = {
  path: "/api/v1/job-application/:id",
};

export default async (req: Request, context: Context) => {
  return new JobApplicationController().handler(req, context);
};
