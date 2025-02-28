import { Config, Context } from "@netlify/functions";
import { OpenApiController } from "../../src/app/open-api/open-api.controller";

export const config: Config = {
  path: "/api/v1/openapi.json",
};

export default async (req: Request, context: Context) => {
  return new OpenApiController().handler(req, context);
};
