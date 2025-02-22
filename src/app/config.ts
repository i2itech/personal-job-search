import { JobApplicationConfig, JobApplicationPersonalInfo } from "../job-application/types";
import { GoogleDriveConfig } from "../vendors/google/drive/google-drive.type";
import { NotionConfig } from "../vendors/notion/notion.types";
import { PuppeteerConfig } from "../vendors/puppeteer/puppeteer.types";

export interface AppConfig {
  server_base_url: string;
}

export interface Config {
  app: AppConfig;
  job_application: JobApplicationConfig;
  notion: NotionConfig;
  google: {
    drive: GoogleDriveConfig;
  };
  puppeteer: PuppeteerConfig;
}

const personalInfo = JSON.parse(process.env.PERSONAL_INFO || "{}") as JobApplicationPersonalInfo;
const googleDriveCredentials = JSON.parse(process.env.GOOGLE_DRIVE_API_CREDENTIALS || "{}");
export default {
  app: {
    server_base_url: process.env.BASE_URL || "",
  },
  job_application: {
    current_cycle: "2025 - Q1",
    personal_info: personalInfo,
    google_drive: {
      cover_letter_folder_id: process.env.COVER_LETTER_FOLDER_ID || "",
      resume_folder_id: process.env.RESUME_FOLDER_ID || "",
    },
  },
  notion: {
    api_key: process.env.NOTION_API_KEY || "",
  },
  google: {
    drive: {
      credentials: googleDriveCredentials,
    },
  },
  puppeteer: {
    chrome_path: process.env.CHROME_PATH || "",
  },
} as Config;
