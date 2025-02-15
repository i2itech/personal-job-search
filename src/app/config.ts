import { NotionConfig } from "../vendors/notion/notion.types";

export interface AppConfig {
  notion: NotionConfig;
}

export default {
  notion: {
    api_key: process.env.NOTION_API_KEY || "",
  },
} as AppConfig;
