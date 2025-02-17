import { NotionClient } from "../../vendors/notion/notion.client";
import { CompanyEntity } from "../entities/company.entity";

type CreateCompanyRequest = Omit<CompanyEntity, "id">;
export class CompanyRepository {
  constructor(private readonly client: NotionClient = new NotionClient()) {}

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

    const response = await this.client.databases.query({
      database_id: CompanyEntity.DatabaseId,
      filter: filter,
    });

    if (response.results.length > 0) {
      return this.notionRowToCompanyEntity(response.results[0]);
    }

    return null;
  }

  async createCompany(company: CreateCompanyRequest) {
    const notionRow = this.companyEntityToNotionRow(company);
    const response = await this.client.pages.create(notionRow);

    return this.notionRowToCompanyEntity(response);
  }

  private notionRowToCompanyEntity(row: any): CompanyEntity {
    const { id, properties } = row;

    return new CompanyEntity({
      id,
      name: properties.Name.title[0].plain_text,
      website_url: properties["Website"].url,
      linkedin_url: properties["LinkedIn"].url,
      is_draft: properties["Is Draft"].checkbox,
    });
  }

  private companyEntityToNotionRow(company: CreateCompanyRequest) {
    return {
      parent: {
        database_id: CompanyEntity.DatabaseId,
      },
      properties: {
        Name: { title: [{ text: { content: company.name } }] },
        ...(company.website_url && {
          Website: {
            url: company.website_url,
          },
        }),
        ...(company.linkedin_url && {
          LinkedIn: {
            url: company.linkedin_url,
          },
        }),
        ...(company.is_draft && { "Is Draft": { checkbox: company.is_draft } }),
      },
    };
  }
}
