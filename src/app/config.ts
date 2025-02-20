import { JobApplicationConfig, JobApplicationPersonalInfo } from "../job-application/types";
import { NotionConfig } from "../vendors/notion/notion.types";

export interface AppConfig {
  job_application: JobApplicationConfig;
  notion: NotionConfig;
}

const personal_info = JSON.parse(process.env.PERSONAL_INFO || "{}") as JobApplicationPersonalInfo;
console.log(personal_info);
export default {
  job_application: {
    current_cycle: "2025 - Q1",
    personal_info,
  },
  notion: {
    api_key: process.env.NOTION_API_KEY || "",
  },
} as AppConfig;
