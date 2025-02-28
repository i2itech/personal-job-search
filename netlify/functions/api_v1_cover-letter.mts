import { Config, Context } from "@netlify/functions";
import Controller from "../../src/job-application/cover-letter/cover-letter.controller";

export const config: Config = {
  path: "/api/v1/cover-letter"
};

export default async (req: Request, context: Context) => {
  const controller = new Controller();
  return controller.handler(req, context);
};
