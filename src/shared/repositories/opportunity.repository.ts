import { CreatePageParameters, UpdatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import { NotionClient } from "../../vendors/notion/notion.client";
import { OpportunityEntity } from "../entities/opportunity.entity";
import { ExternalFile, OpportunityType } from "../types";

type CreateOpportunityRequest = Omit<OpportunityEntity, "id">;
type UpdateOpportunityRequest = Partial<OpportunityEntity> & { id: OpportunityEntity["id"] };
export class OpportunityRepository {
  constructor(private readonly client: NotionClient = new NotionClient()) {}

  async findOneById(id: string) {
    const response = await this.client.pages.retrieve({ page_id: id });

    if (!response) {
      throw new Error("Failed to find job application");
    }

    return this.notionRowToOpportunityEntity(response);
  }

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
    const request = this.opportunityEntityToCreateNotionRow(opportunity);
    const response = await this.client.pages.create(request);

    return this.notionRowToOpportunityEntity(response);
  }

  async updateOpportunity(opportunity: UpdateOpportunityRequest) {
    const request = this.opportunityEntityToUpdateNotionRow(opportunity);
    const response = await this.client.pages.update(request);

    return this.notionRowToOpportunityEntity(response);
  }

  private notionRowToOpportunityEntity(row: any): OpportunityEntity {
    const { id, properties } = row;

    return new OpportunityEntity({
      id,
      title: properties.Title.title[0].plain_text,
      type: properties.Type.select.name as OpportunityType,
      posting_url: properties["Posting URL"].url,
      application_status: properties["Application Status"].status?.name,
      lead_status: properties["Lead Status"].status?.name,
      tags: properties.Tags.multi_select.map((tag: any) => tag.name),
      job_description: properties["Job Description"].rich_text.map((text: any) => text.plain_text).join(""),
      job_analysis: properties["Job Analysis"].rich_text.map((text: any) => text.plain_text).join(""),
      resume: this.notionRowToExternalFile(properties.Resume.files),
      cover_letter: this.notionRowToExternalFile(properties["Cover Letter"].files),
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
      company_name: properties["Company Name"].rollup.array.map((company: any) => company.title[0].plain_text).join(""),
      is_draft: properties["Is Draft"].checkbox,
      // Note: Company and primary_contacts would need to be populated separately
      // as they are relations that require additional queries
    });
  }

  private notionRowToExternalFile(files?: { external?: { url: string }; name: string }[]): ExternalFile | undefined {
    if (!files || files.length === 0) {
      return undefined;
    }

    const file = files[0];

    if (!file.external) {
      return undefined;
    }

    return { url: file.external.url, name: file.name };
  }

  private opportunityEntityToCreateNotionRow(opportunity: CreateOpportunityRequest): CreatePageParameters {
    return {
      parent: {
        database_id: OpportunityEntity.DatabaseId,
      },
      properties: this.opportunityEntityToUpdateNotionProperties(opportunity),
    };
  }

  private opportunityEntityToUpdateNotionRow(opportunity: UpdateOpportunityRequest): UpdatePageParameters {
    return {
      page_id: opportunity.id,
      properties: this.opportunityEntityToUpdateNotionProperties(opportunity),
    };
  }

  private opportunityEntityToUpdateNotionProperties(opportunity: Partial<OpportunityEntity>) {
    return {
      ...(opportunity.title && { Title: { title: [{ text: { content: opportunity.title } }] } }),
      ...(opportunity.type && { Type: { select: { name: opportunity.type } } }),
      ...(opportunity.cycle && { Cycle: { select: { name: opportunity.cycle } } }),
      ...(opportunity.company_id && {
        Company: {
          relation: [{ id: opportunity.company_id }],
        },
      }),
      ...(opportunity.pay_type && {
        "Pay Type": { select: { name: opportunity.pay_type } },
      }),
      ...(opportunity.posting_url && {
        "Posting URL": { url: opportunity.posting_url },
      }),
      ...(opportunity.job_description && {
        "Job Description": {
          rich_text: this.expandRichText(opportunity.job_description),
        },
      }),
      ...(opportunity.resume && {
        Resume: { files: [{ external: { url: opportunity.resume.url }, name: opportunity.resume.name }] },
      }),
      ...(opportunity.cover_letter && {
        "Cover Letter": {
          files: [{ external: { url: opportunity.cover_letter.url }, name: opportunity.cover_letter.name }],
        },
      }),
      ...(opportunity.min_estimated_value && {
        "Min Estimated Value": { number: opportunity.min_estimated_value },
      }),
      ...(opportunity.max_estimated_value && {
        "Max Estimated Value": { number: opportunity.max_estimated_value },
      }),
      ...(opportunity.is_draft && { "Is Draft": { checkbox: opportunity.is_draft } }),
      ...(opportunity.job_analysis && {
        "Job Analysis": {
          rich_text: this.expandRichText(opportunity.job_analysis),
        },
      }),
    };
  }

  private expandRichText(richText: string) {
    return richText.split("\n").map((line) => ({ text: { content: `${line}\n` } }));
  }
}
