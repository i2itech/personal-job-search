import { CompanyEntity } from "./company.entity";
import { ContactEntity } from "./contact.entity";

export class OpportunityEntity {
  static DatabaseId: string = "f7dc427eca374fa3b91279e01cbed5eb";

  constructor(partial: Partial<OpportunityEntity> = {}) {
    Object.assign(this, partial);
  }

  id: string;
  title: string;
  type: OpportunityType;
  company_id?: string;
  company?: CompanyEntity;
  primary_contacts?: ContactEntity[] = [];
  posting_url?: string;
  application_status?: string;
  lead_status?: string;
  tags?: string[] = [];
  job_description?: string;
  resume?: string;
  cover_letter?: string;
  min_estimated_value?: number;
  max_estimated_value?: number;
  estimated_value?: number;
  date_applied?: Date;
  pay_type?: string;
  cycle?: string;
  results?: string;
  is_draft?: boolean;
}

export enum OpportunityType {
  JOB_APPLICATION = "Job Application",
  SALES_LEAD = "Sales Lead",
}
