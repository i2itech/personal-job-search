import { JobApplicationService } from "./job-application/job-application.service";

const jobApplicationService = new JobApplicationService();

const main = async () => {
  const jobApplication = await jobApplicationService.import({
    company_name: "Trilogy",
    job_title: "AI Super Engineer",
  });

  console.log(jobApplication);
};

main();
