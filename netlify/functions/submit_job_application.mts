import { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  return new Response("Hello World", { status: 200 });
};

export const config: Config = {
  path: "/api/v1/submit-job-application",
};
