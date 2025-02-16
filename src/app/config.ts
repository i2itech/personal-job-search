import { JobApplicationConfig } from "../job-application/types";
import { NotionConfig } from "../vendors/notion/notion.types";

export interface AppConfig {
  job_application: JobApplicationConfig;
  notion: NotionConfig;
}

export default {
  job_application: {
    current_cycle: "2025 - Q1",
  },
  notion: {
    api_key: process.env.NOTION_API_KEY || "",
  },
} as AppConfig;
