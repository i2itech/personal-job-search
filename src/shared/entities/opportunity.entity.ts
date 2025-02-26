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

  id: string;

  @NotionEntityProperty({ type: "title" })
  title: string;

  @NotionEntityProperty({ type: "select" })
  type: OpportunityType;

  @NotionEntityProperty({ type: "relation" })
  company_id?: string;

  @NotionEntityProperty({ type: "rollup" })
  company_name?: string;

  @NotionEntityProperty({ type: "url" })
  posting_url?: string;

  @NotionEntityProperty({ type: "select" })
  application_status?: string;

  @NotionEntityProperty({ type: "select" })
  lead_status?: string;

  @NotionEntityProperty({ type: "multi_select" })
  tags?: string[] = [];

  @NotionEntityProperty({ type: "rich_text" })
  job_description?: string;

  @NotionEntityProperty({ type: "rich_text" })
  job_analysis?: string;

  @NotionEntityProperty({ type: "files" })
  resume?: ExternalFile;

  @NotionEntityProperty({ type: "files" })
  cover_letter?: ExternalFile;

  @NotionEntityProperty({ type: "number" })
  min_estimated_value?: number;

  @NotionEntityProperty({ type: "number" })
  max_estimated_value?: number;

  @NotionEntityProperty({ type: "formula" })
  estimated_value?: number;

  @NotionEntityProperty({ type: "date" })
  date_applied?: Date;

  @NotionEntityProperty({ type: "select" })
  pay_type?: string;

  @NotionEntityProperty({ type: "select" })
  cycle?: string;

  @NotionEntityProperty({ type: "rich_text" })
  results?: string;

  @NotionEntityProperty({ type: "checkbox" })
  is_draft?: boolean;

  company?: CompanyEntity;
  primary_contacts?: ContactEntity[] = [];
}
