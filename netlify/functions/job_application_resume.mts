import { Config, Context } from "@netlify/functions";
import { GenerateResumeRequest } from "../../src/job-application/types";
import { ResumeService } from "../../src/job-application/resume-service";
export const config: Config = {
  path: "/api/v1/job-application/resume",
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
    const resume = await resumeService.generateResume(body);

    return new Response(resume, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
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
