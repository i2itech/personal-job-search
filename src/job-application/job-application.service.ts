import appConfig from "../app/config";
import { OpportunityType } from "../shared/entities/opportunity.entity";
import { CompanyRepository } from "../shared/repositories/company.respository";
import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { CreateJobApplicationRequest } from "./types";

export class JobApplicationService {
  private currentCycle: string = appConfig.job_application.current_cycle;

  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private readonly companyRepository: CompanyRepository = new CompanyRepository()
  ) {}

  async findById(id: string) {
    return await this.opportunityRepository.findOneById(id);
  }

  async import(application: CreateJobApplicationRequest) {
    // Try to find existing job application for this period
    const existingApplication = await this.findExistingJobApplication(application);
    // If found, return the existing job application
    if (existingApplication) {
      return existingApplication;
    }
    // If not found, create a new job application
    const newApplication = await this.createNewJobApplication(application);
    // Return the new job application
    return newApplication;
  }

  private findExistingJobApplication(application: CreateJobApplicationRequest) {
    // Try to find existing job application for this period
    const existingApplication = this.opportunityRepository.findOneMatchingOpportunity({
      type: OpportunityType.JOB_APPLICATION,
      cycle: this.currentCycle,
      title: application.job_title,
      company_name: application.company_name,
      posting_url: application.job_posting_url,
    });

    return existingApplication;
  }

  private async createNewJobApplication(application: CreateJobApplicationRequest) {
    // Searches for company
    let company = await this.companyRepository.findOneMatchingCompany({
      name: application.company_name,
      website_url: application.company_website_url,
      linkedin_url: application.company_linkedin_url,
    });

    if (!company) {
      company = await this.companyRepository.createCompany({
        name: application.company_name,
        website_url: application.company_website_url,
        linkedin_url: application.company_linkedin_url,
        is_draft: true,
      });
    }

    const newJobApplication = await this.opportunityRepository.createOpportunity({
      type: OpportunityType.JOB_APPLICATION,
      cycle: this.currentCycle,
      title: application.job_title,
      company_id: company.id,
      job_description: application.job_description,
      job_analysis: application.job_analysis,
      posting_url: application.job_posting_url,
      pay_type: application.pay_type,
      min_estimated_value: application.min_estimated_value,
      max_estimated_value: application.max_estimated_value,
      is_draft: true,
    });

    return newJobApplication;
  }
}
