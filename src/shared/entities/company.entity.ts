import { NotionEntity, NotionEntityProperty } from "../../vendors/notion/notion-entity.decorator";
import { ContactEntity } from "./contact.entity";

@NotionEntity({
  database_id: "ad56d3e62f9c4774bdc379f98fca4b9f",
})
export class CompanyEntity {
  constructor(partial: Partial<CompanyEntity> = {}) {
    Object.assign(this, partial);
  }

  @NotionEntityProperty({ type: "id" })
  id: string;

  @NotionEntityProperty({ type: "title", notionKey: "Name" })
  name: string;

  @NotionEntityProperty({ type: "relation", notionKey: "Contacts" })
  contact_ids?: string[];

  @NotionEntityProperty({ type: "url", notionKey: "Website" })
  website_url?: string;

  @NotionEntityProperty({ type: "url", notionKey: "LinkedIn" })
  linkedin_url?: string;

  @NotionEntityProperty({ type: "checkbox", notionKey: "Is Draft" })
  is_draft?: boolean;

  contacts?: ContactEntity[] = [];
}
