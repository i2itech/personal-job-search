import "reflect-metadata";
import dotenv from "dotenv";
import { ResumeService } from "./job-application/resume/resume.service";
import { UpsertResumeDetailsRequest } from "./job-application/types/dtos/job-application.dtos";
import appConfig from "./app/config";

dotenv.config({ path: ".env" });

const main = async () => {
  const resume: UpsertResumeDetailsRequest = {
    type: "summary",
    job_application_id: "19f89768-cbfe-8130-a838-f9d6333ce097",
    summary:
      "Accomplished software engineer with 15+ years of experience, known for driving innovation in the tech sector, especially within Fortune 500 companies. My recent projects have leveraged generative AI to enhance software development, demonstrating my ability to integrate emerging technologies seamlessly into practical, efficient solutions. Proficient in the full software development lifecycle, I excel in agile environments, embodying a collaborative ethos while delivering high-quality software solutions. My commitment to continuous improvement and ability to adapt to the latest technological advancements highlight my role as a dynamic contributor to any engineering team.",
  };

  const notionApiKey = process.env.NOTION_API_KEY;
  if (!notionApiKey) {
    throw new Error("NOTION_API_KEY is not set");
  }

  const resumeService = new ResumeService();
  const resumeDetails = await resumeService.upsertResumeDetails(resume);
  console.log(JSON.stringify(resumeDetails, null, 2));
};

main();
