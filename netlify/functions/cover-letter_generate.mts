import { Config, Context } from "@netlify/functions";
import { CoverLetterController } from "../../src/job-application/cover-letter/cover-letter.controller";

// const CoverLetterFunctionInstance = new CoverLetterController() as NetlifyFunctionController;
export const config: Config = {
  path: "/api/v1/cover-letter",
};

export default async (req: Request, context: Context) => {
  return new CoverLetterController().handler(req, context);
};
