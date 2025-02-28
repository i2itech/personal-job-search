import { NotionDatabaseAdapter } from "../../vendors/notion/notion-database-adapter";
import { OpportunityEntity } from "../entities/opportunity.entity";
import { OpportunityType } from "../types";
import { BaseRepository } from "./base.repository";
type CreateOpportunityRequest = Omit<OpportunityEntity, "id">;
type UpdateOpportunityRequest = Partial<OpportunityEntity> & { id: OpportunityEntity["id"] };
export class OpportunityRepository extends BaseRepository<OpportunityEntity> {
  constructor() {
    super(new NotionDatabaseAdapter(OpportunityEntity));
  }

  async findOneById(id: string) {
    return this.findById(id);
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

    return this.findBy(filter);
  }

  async createOpportunity(opportunity: CreateOpportunityRequest) {
    return this.create(opportunity);
  }

  async updateOpportunity(opportunity: UpdateOpportunityRequest) {
    return this.update(opportunity);
  }
}
