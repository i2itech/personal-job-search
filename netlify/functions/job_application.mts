import { Config, Context } from "@netlify/functions";
import { JobApplicationService } from "../../src/job-application/job-application.service";
import { CreateJobApplicationRequest } from "../../src/job-application/types";

export const config: Config = {
  path: "/api/v1/job-application",
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "POST": {
      const body = await req.json();
      return await createJobApplication(body);
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};

const createJobApplication = async (body: CreateJobApplicationRequest) => {
  try {
    const jobApplicationService = new JobApplicationService();
    const jobApplication = await jobApplicationService.create(body);

    return new Response(
      JSON.stringify({
        message: "Application submitted successfully",
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
