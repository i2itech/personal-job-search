import { Config, Context } from "@netlify/functions";
import { GenerateCoverLetterRequest } from "../../../../src/job-application/types";
import { CoverLetterService } from "../../../../src/job-application/cover-letter/cover-letter.service";

export const config: Config = {
  path: "/api/v1/job-application/cover-letter",
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "POST": {
      const body = await req.json();
      return await generateCoverLetter(body);
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};

const generateCoverLetter = async (body: GenerateCoverLetterRequest) => {
  try {
    const coverLetterService = new CoverLetterService();
    const jobApplication = await coverLetterService.generate(body);

    return new Response(
      JSON.stringify({
        message: "Cover letter generated successfully and job application updated",
        job_application: jobApplication,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing job application:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process application",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
