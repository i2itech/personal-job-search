import { Config, Context } from "@netlify/functions";
import Controller from "../../src/app/open-api/open-api.controller";

export const config: Config = {
  path: "/api/v1/openapi.json"
};

export default async (req: Request, context: Context) => {
  const controller = new Controller();
  return controller.handler(req, context);
};
