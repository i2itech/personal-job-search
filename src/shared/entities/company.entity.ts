import { ContactEntity } from "./contact.entity";

export class CompanyEntity {
  constructor(partial: Partial<CompanyEntity> = {}) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  contacts: ContactEntity[];
  website_url: string;
  linkedin_url: string;
}
