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

    return response.results.map((result) => {
      return new OpportunityEntity(result);
    });
  }
}
