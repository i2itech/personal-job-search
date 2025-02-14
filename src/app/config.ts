import { NotionConfig } from "../vendors/notion/notion.types";

export interface AppConfig {
  notion: NotionConfig;
}

export const appConfig: AppConfig = {
  notion: {
    api_key: process.env.NOTION_API_KEY || "",
  },
};
