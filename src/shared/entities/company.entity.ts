import { ContactEntity } from "./contact.entity";

export class CompanyEntity {
  static DatabaseId: string = "ad56d3e62f9c4774bdc379f98fca4b9f";
  constructor(partial: Partial<CompanyEntity> = {}) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  contacts?: ContactEntity[] = [];
  website_url?: string;
  linkedin_url?: string;
}
