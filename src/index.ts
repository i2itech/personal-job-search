import dotenv from "dotenv";
import "reflect-metadata";
import { ResumeService } from "./job-application/resume/resume.service";
import { GenerateResumeRequest } from "./job-application/types/dtos/job-application.dtos";

dotenv.config({ path: ".env" });

const main = async () => {
  const resume: GenerateResumeRequest = {
    job_application_id: "1a589768-cbfe-8147-86de-e21350195100",
  };

  const resumeService = new ResumeService();
  const resumeDetails = await resumeService.generateResume(resume);
  console.log(JSON.stringify(resumeDetails, null, 2));
};

main();
