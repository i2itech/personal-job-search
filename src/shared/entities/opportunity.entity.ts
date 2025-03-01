import { NotionEntity, NotionEntityProperty } from "../../vendors/notion/notion-entity.decorator";
import { ExternalFile, Opportunity } from "../types";
import { OpportunityType } from "../types/opportunity.types";
import { CompanyEntity } from "./company.entity";
import { ContactEntity } from "./contact.entity";

@NotionEntity({
  database_id: "f7dc427eca374fa3b91279e01cbed5eb",
})
export class OpportunityEntity implements Opportunity {
  constructor(partial: Partial<OpportunityEntity> = {}) {
    Object.assign(this, partial);
  }

  @NotionEntityProperty({ type: "id", notionKey: "id" })
  id: string;

  @NotionEntityProperty({ type: "title", notionKey: "Title" })
  title: string;

  @NotionEntityProperty({ type: "select", notionKey: "Type" })
  type: OpportunityType;

  @NotionEntityProperty({ type: "relation", notionKey: "Company" })
  company_id?: string;

  @NotionEntityProperty({ type: "rollup", notionKey: "Company Name" })
  company_name?: string;

  @NotionEntityProperty({ type: "url", notionKey: "Posting URL" })
  posting_url?: string;

  @NotionEntityProperty({ type: "select", notionKey: "Application Status" })
  application_status?: string;

  @NotionEntityProperty({ type: "select", notionKey: "Lead Status" })
  lead_status?: string;

  @NotionEntityProperty({ type: "multi_select", notionKey: "Tags" })
  tags?: string[] = [];

  @NotionEntityProperty({ type: "rich_text", notionKey: "Job Description" })
  job_description?: string;

  @NotionEntityProperty({ type: "rich_text", notionKey: "Job Analysis" })
  job_analysis?: string;

  @NotionEntityProperty({ type: "files", notionKey: "Resume" })
  resume?: ExternalFile;

  @NotionEntityProperty({ type: "files", notionKey: "Cover Letter" })
  cover_letter?: ExternalFile;

  @NotionEntityProperty({ type: "number", notionKey: "Min Estimated Value" })
  min_estimated_value?: number;

  @NotionEntityProperty({ type: "number", notionKey: "Max Estimated Value" })
  max_estimated_value?: number;

  @NotionEntityProperty({ type: "formula", notionKey: "Estimated Value" })
  estimated_value?: number;

  @NotionEntityProperty({ type: "date", notionKey: "Date Applied" })
  date_applied?: Date;

  @NotionEntityProperty({ type: "select", notionKey: "Pay Type" })
  pay_type?: string;

  @NotionEntityProperty({ type: "select", notionKey: "Cycle" })
  cycle?: string;

  @NotionEntityProperty({ type: "rich_text", notionKey: "Results" })
  results?: string;

  @NotionEntityProperty({ type: "checkbox", notionKey: "Is Draft" })
  is_draft?: boolean;

  company?: CompanyEntity;
  primary_contacts?: ContactEntity[] = [];
}
