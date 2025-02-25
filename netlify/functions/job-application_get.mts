import { Config, Context } from "@netlify/functions";
import { JobApplicationService } from "../../src/job-application/job-application.service";

export const config: Config = {
  path: "/api/v1/job-application/:id",
};

export default async (req: Request, context: Context) => {
  switch (req.method) {
    case "GET": {
      const id = context.params.id;
      console.log("Getting job application for id: ", id);
      return await getJobApplication(id);
    }
    default:
      return new Response("Method not allowed", { status: 405 });
  }
};

const getJobApplication = async (id: string) => {
  try {
    const jobApplicationService = new JobApplicationService();
    const jobApplication = await jobApplicationService.findById(id);

    return new Response(JSON.stringify(jobApplication), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error finding job application:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to find job application",
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
