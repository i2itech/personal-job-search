import { Config, Context } from "@netlify/functions";
import Controller from "../../src/job-application/job-application.controller";

export const config: Config = {
  path: "/api/v1/job-application/:id"
};

export default async (req: Request, context: Context) => {
  const controller = new Controller();
  return controller.handler(req, context);
};
