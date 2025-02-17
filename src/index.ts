import "dotenv/config";
import { JobApplicationService } from "./job-application/job-application.service";

const jobApplicationService = new JobApplicationService();

const main = async () => {
  const jobApplication = await jobApplicationService.import({
    company_name: "Trilogy 2",
    job_title: "AI Super Engineer 2",
  });

  console.log(jobApplication);
};

main();
