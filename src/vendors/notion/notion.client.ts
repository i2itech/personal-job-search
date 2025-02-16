import { Client } from "@notionhq/client";
import { NotionConfig } from "./notion.types";
import appConfig from "../../app/config";

export class NotionClient extends Client {
  constructor(config: NotionConfig = appConfig.notion) {
    super({ auth: config?.api_key });
  }
}
