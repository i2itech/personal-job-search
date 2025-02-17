import { NotionClient } from "../../vendors/notion/notion.client";
import { OpportunityEntity, OpportunityType } from "../entities/opportunity.entity";

export class OpportunityRepository {
  private readonly databaseId: string = "f7dc427eca374fa3b91279e01cbed5eb";
  constructor(private readonly client: NotionClient = new NotionClient()) {}

  async findMatchingOpportunity({
    type,
    title,
    company_name,
    posting_url,
    cycle,
  }: {
    type: OpportunityType;
    cycle: string;
    title?: string;
    company_name?: string;
    posting_url?: string;
  }) {
    const typeFilter = {
      property: "Type",
      select: {
        equals: type,
      },
    };

    const cycleFilter = {
      property: "Cycle",
      select: {
        equals: cycle,
      },
    };

    const titleFilter = title
      ? {
          property: "title",
          title: {
            equals: title,
          },
        }
      : undefined;

    const companyFilter = company_name
      ? {
          property: "Company Name",
          rollup: {
            any: {
              rich_text: {
                contains: company_name || "",
              },
            },
          },
        }
      : undefined;

    const postingUrlFilter = posting_url
      ? {
          property: "Posting URL",
          url: {
            equals: posting_url,
          },
        }
      : undefined;

    const titleCompanyFilter =
      titleFilter && companyFilter
        ? [
            {
              and: [typeFilter, cycleFilter, titleFilter, companyFilter],
            },
          ]
        : [];

    const titleCompanyPostingUrlFilter = postingUrlFilter
      ? [
          {
            and: [typeFilter, cycleFilter, postingUrlFilter],
          },
        ]
      : [];

    const filter = {
      or: [...titleCompanyFilter, ...titleCompanyPostingUrlFilter],
    };
    const response = await this.client.databases.query({
      database_id: this.databaseId,
      filter: filter,
    });

    return response.results.map(this.notionRowToOpportunityEntity);
  }

  private notionRowToOpportunityEntity(row: any): OpportunityEntity {
    const { id, properties } = row;

    return new OpportunityEntity({
      id,
      type: properties.Type.select.name as OpportunityType,
      posting_url: properties["Posting URL"].url,
      application_status: properties["Application Status"].status?.name,
      lead_status: properties["Lead Status"].status?.name,
      tags: properties.Tags.multi_select.map((tag: any) => tag.name),
      job_description: properties["Job Description"].rich_text.map((text: any) => text.plain_text).join(""),
      resume: properties.Resume.rich_text.map((text: any) => text.plain_text).join(""),
      cover_letter: properties["Cover Letter"].rich_text.map((text: any) => text.plain_text).join(""),
      min_estimated_value: properties["Min Estimated Value"].number,
      max_estimated_value: properties["Max Estimated Value"].number,
      estimated_value: properties["Estimated Value"].formula.number,
      date_applied: properties["Date Applied"].date?.start
        ? new Date(properties["Date Applied"].date.start)
        : undefined,
      pay_type: properties["Pay Type"].select?.name,
      cycle: properties.Cycle.select?.name,
      results: properties.Results.rich_text.map((text: any) => text.plain_text).join(""),
      company_id: properties.Company.relation[0]?.id,
      // Note: Company and primary_contacts would need to be populated separately
      // as they are relations that require additional queries
    });
  }
}
