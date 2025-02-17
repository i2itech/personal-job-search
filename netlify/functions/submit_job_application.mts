import { Config, Context } from "@netlify/functions";
import { JobApplicationService } from "../../src/job-application/job-application.service";
export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    const jobApplicationService = new JobApplicationService();
    const jobApplication = await jobApplicationService.import(body);

    // TODO: Add your job application processing logic here
    // For example: save to database, send notifications, etc.

    return new Response(
      JSON.stringify({
        message: "Application submitted successfully",
        jobApplication,
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

export const config: Config = {
  path: "/api/v1/submit-job-application",
};
