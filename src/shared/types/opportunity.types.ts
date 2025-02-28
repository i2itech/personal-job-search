import { z } from "zod";
import { ExternalFileSchema } from "./common.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export enum OpportunityType {
  JOB_APPLICATION = "Job Application",
  SALES_LEAD = "Sales Lead",
}

export const OpportunitySchema = z
  .object({
    id: z.string(),
    title: z.string(),
    type: z.nativeEnum(OpportunityType),
    company_id: z.string().optional(),
    company_name: z.string().optional(),
    posting_url: z.string().optional(),
    application_status: z.string().optional(),
    lead_status: z.string().optional(),
    tags: z.array(z.string()).optional(),
    job_description: z.string().optional(),
    job_analysis: z.string().optional(),
    resume: ExternalFileSchema.optional(),
    cover_letter: ExternalFileSchema.optional(),
    min_estimated_value: z.number().optional(),
    max_estimated_value: z.number().optional(),
    estimated_value: z.number().optional(),
    date_applied: z.date().optional(),
    pay_type: z.string().optional(),
    cycle: z.string().optional(),
    results: z.string().optional(),
    is_draft: z.boolean().optional(),
  })
  .openapi("Opportunity");

export type Opportunity = z.infer<typeof OpportunitySchema>;
