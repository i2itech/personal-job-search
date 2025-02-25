import { Config, Context } from "@netlify/functions";
import { ResumeService } from "../../src/job-application/resume/resume.service";
import { GenerateResumeRequest } from "../../src/job-application/types";

export const config: Config = {
  path: "/api/v1/job-application/resume/generate",
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "POST": {
      const body = await req.json();
      return await generateResume(body);
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};

const generateResume = async (body: GenerateResumeRequest) => {
  try {
    const resumeService = new ResumeService();
    const jobApplication = await resumeService.generateResume(body);

    return new Response(
      JSON.stringify({
        message: "Resume generated successfully and job application updated",
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
        error: error.message,
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
