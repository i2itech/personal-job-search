import { Config, Context } from "@netlify/functions";
import { JobApplicationIdController } from "../../src/job-application/job-application-id.controller";

export const config: Config = {
  path: "/api/v1/job-application/:id",
};

export default async (req: Request, context: Context) => {
  return new JobApplicationIdController().handler(req, context);
};
