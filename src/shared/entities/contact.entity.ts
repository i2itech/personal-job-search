import { CompanyEntity } from "./company.entity";

export class ContactEntity {
  static DatabaseId: string = "ad56d3e62f9c4774bdc379f98fca4b9f";

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
