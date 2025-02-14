import { CompanyEntity } from "./company.entity";

export class ContactEntity {
  constructor(partial: Partial<ContactEntity> = {}) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  company: CompanyEntity;
  email: string;
  phone: string;
  linkedin_url: string;
  title: string;
}
