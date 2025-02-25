import "../../src/bootstrap";
import { Config, Context } from "@netlify/functions";
import { ResumeService } from "../../src/job-application/resume/resume.service";
import { UpsertResumeDetailsRequest } from "../../src/job-application/types";
export const config: Config = {
  path: "/api/v1/resume",
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "POST": {
      const body = await req.json();
      return await upsertResumeDetails(body);
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};

const upsertResumeDetails = async (body: UpsertResumeDetailsRequest) => {
  const resumeService = new ResumeService();
  try {
    const resumeDetails = await resumeService.upsertResumeDetails(body);

    return new Response(
      JSON.stringify({
        message: "Resume details updated successfully",
        resume_details: resumeDetails,
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
