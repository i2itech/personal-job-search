import { Client } from "@notionhq/client";
import { NotionConfig } from "./notion.types";

export class NotionClient extends Client {
  constructor(config: NotionConfig) {
    super({ auth: config?.api_key });
  }
}
