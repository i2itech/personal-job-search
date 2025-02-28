import { Config, Context } from "@netlify/functions";
import Controller from "../../src/job-application/resume/resume.controller";

export const config: Config = {
  path: "/api/v1/resume/generate"
};

export default async (req: Request, context: Context) => {
  const controller = new Controller();
  return controller.handler(req, context);
};
