import { NotionDatabaseAdapter } from "../../vendors/notion/notion-database-adapter";
import { Database } from "../database";
import { CompanyEntity } from "../entities/company.entity";
import { BaseRepository } from "./base.repository";

type CreateCompanyRequest = Omit<CompanyEntity, "id">;
export class CompanyRepository extends BaseRepository<CompanyEntity> {
  constructor(db: Database<CompanyEntity> = new NotionDatabaseAdapter(CompanyEntity)) {
    super(db);
  }

  async findOneMatchingCompany({
    name,
    website_url,
    linkedin_url,
  }: {
    name: string;
    website_url?: string;
    linkedin_url?: string;
  }) {
    const filterOptions = [];

    filterOptions.push({
      property: "Name",
      rich_text: {
        contains: name,
      },
    });

    if (website_url) {
      filterOptions.push({
        property: "Website",
        url: {
          equals: website_url,
        },
      });
    }

    if (linkedin_url) {
      filterOptions.push({
        property: "LinkedIn",
        url: {
          equals: linkedin_url,
        },
      });
    }

    const filter = {
      or: [...filterOptions],
    };

    return await this.findOne(filter);
  }

  async createCompany(company: CreateCompanyRequest) {
    return this.create(company);
  }
}
