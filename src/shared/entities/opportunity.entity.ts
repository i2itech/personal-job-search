import { CompanyEntity } from "./company.entity";
import { ContactEntity } from "./contact.entity";

export class OpportunityEntity {
  constructor(partial: Partial<OpportunityEntity> = {}) {
    Object.assign(this, partial);
  }

  id: string;
  type: OpportunityType;
  company: CompanyEntity;
  primary_contacts: ContactEntity[];
  posting_url: string;
  application_status: string;
  lead_status: string;
  tags: string[];
  job_description: string;
  resume: string;
  cover_letter: string;
  min_estimated_value: number;
  max_estimated_value: number;
  estimated_value: number;
  date_applied: Date;
  pay_type: string;
  cycle: string;
  results: string;
}

export enum OpportunityType {
  JOB_APPLICATION = "Job Application",
  SALES_LEAD = "Sales Lead",
}
