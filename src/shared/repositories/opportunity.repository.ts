import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { NotionClient } from "../../vendors/notion/notion.client";
import { OpportunityEntity, OpportunityType } from "../entities/opportunity.entity";

type CreateOpportunityRequest = Omit<OpportunityEntity, "id">;
export class OpportunityRepository {
  constructor(private readonly client: NotionClient = new NotionClient()) {}

  async findOneMatchingOpportunity({
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
      database_id: OpportunityEntity.DatabaseId,
      filter: filter,
    });

    if (response.results.length > 0) {
      return this.notionRowToOpportunityEntity(response.results[0]);
    }

    return null;
  }

  async createOpportunity(opportunity: CreateOpportunityRequest) {
    const request = this.opportunityEntityToNotionRow(opportunity);
    const response = await this.client.pages.create(request);

    return this.notionRowToOpportunityEntity(response);
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
      is_draft: properties["Is Draft"].checkbox,
      // Note: Company and primary_contacts would need to be populated separately
      // as they are relations that require additional queries
    });
  }

  private opportunityEntityToNotionRow(opportunity: CreateOpportunityRequest): CreatePageParameters {
    return {
      parent: {
        database_id: OpportunityEntity.DatabaseId,
      },
      properties: {
        Title: { title: [{ text: { content: opportunity.title } }] },
        Type: { type: "select", select: { name: opportunity.type } },
        ...(opportunity.cycle && { Cycle: { type: "select", select: { name: opportunity.cycle } } }),
        ...(opportunity.company_id && {
          Company: {
            type: "relation",
            relation: [{ id: opportunity.company_id }],
          },
        }),
        ...(opportunity.pay_type && {
          "Pay Type": { type: "select", select: { name: opportunity.pay_type } },
        }),
        ...(opportunity.posting_url && {
          "Posting URL": { url: opportunity.posting_url },
        }),
        ...(opportunity.job_description && {
          "Job Description": {
            rich_text: opportunity.job_description.split("\n\n").map((line) => ({ text: { content: `${line}\n\n` } })),
          },
        }),
        ...(opportunity.resume && {
          Resume: { rich_text: [{ text: { content: opportunity.resume } }] },
        }),
        ...(opportunity.cover_letter && {
          "Cover Letter": { rich_text: [{ text: { content: opportunity.cover_letter } }] },
        }),
        ...(opportunity.min_estimated_value && {
          "Min Estimated Value": { number: opportunity.min_estimated_value },
        }),
        ...(opportunity.max_estimated_value && {
          "Max Estimated Value": { number: opportunity.max_estimated_value },
        }),
        ...(opportunity.is_draft && { "Is Draft": { checkbox: opportunity.is_draft } }),
      },
    };
  }
}
