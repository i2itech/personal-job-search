import appConfig from "../app/config";
import { OpportunityType } from "../shared/entities/opportunity.entity";
import { CompanyRepository } from "../shared/repositories/company.respository";
import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { ImportJobApplicationRequest, UpdateJobApplication } from "./types";

export class JobApplicationService {
  private currentCycle: string = appConfig.job_application.current_cycle;

  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private readonly companyRepository: CompanyRepository = new CompanyRepository()
  ) {}

  async import(application: ImportJobApplicationRequest) {
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

  async update(application: UpdateJobApplication) {
    const { job_application_id, resume, cover_letter, job_analysis } = application;
    if (!job_application_id || (!resume && !cover_letter && !job_analysis)) {
      throw new Error("Invalid job application request");
    }
    // Try to find existing job application for this period
    const existingApplication = await this.findExistingJobApplication(application);

    // If not found, create a new job application
    const newApplication = await this.createNewJobApplication(application);
  }

  private findExistingJobApplication(application: ImportJobApplicationRequest) {
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

  private async createNewJobApplication(application: ImportJobApplicationRequest) {
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
      posting_url: application.job_posting_url,
      pay_type: application.pay_type,
      is_draft: true,
    });

    return newJobApplication;
  }

  private async updateJobApplication(application: UpdateJobApplication) {}
}
