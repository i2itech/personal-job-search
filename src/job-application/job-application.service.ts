import appConfig from "../app/config";
import { CompanyRepository } from "../shared/repositories/company.respository";
import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { OpportunityType } from "../shared/types";
import { CreateJobApplicationRequest, UpdateJobApplicationRequest } from "./types";
import { getLogger } from "../shared/logger.service";

const Logger = getLogger("job-application:service");

export class JobApplicationService {
  private currentCycle: string = appConfig().job_application.current_cycle;

  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private readonly companyRepository: CompanyRepository = new CompanyRepository()
  ) {}

  async findById(id: string) {
    try {
      Logger.info(`Finding job application with id: ${id}`);
      const opportunity = await this.opportunityRepository.findOneById(id);
      Logger.info(`Found job application with id: ${id}`);
      return opportunity;
    } catch (error) {
      Logger.error(`Error finding job application with id ${id}:`, error);
      throw new Error("Failed to find job application");
    }
  }

  async create(application: CreateJobApplicationRequest) {
    Logger.info(`Attempting to create job application for ${application.company_name} - ${application.job_title}`);
    // Try to find existing job application for this period
    const existingApplication = await this.findExistingJobApplication(application);
    if (existingApplication) {
      Logger.error(`Found existing application`);
      throw new Error("Job application already exists");
    }
    // If not found, create a new job application
    const newApplication = await this.createNewJobApplication(application);
    Logger.info(`Successfully created new job application with id: ${newApplication.id}`);
    // Return the new job application
    return newApplication;
  }

  async update(id: string, application: UpdateJobApplicationRequest) {
    Logger.info(`Attempting to update job application with id: ${id}`);
    // Try to find existing job application for this period
    const existingApplication = await this.findById(id);
    // If not found, throw an error
    if (!existingApplication) {
      Logger.error(`Job application with id ${id} not found`);
      throw new Error("Job application not found");
    }
    // Update the job application
    const updatedApplication = await this.opportunityRepository.updateOpportunity({
      ...application,
      id,
      date_applied: application.date_applied,
    });
    Logger.info(`Successfully updated job application with id: ${id}`);
    // Return the updated job application
    return updatedApplication;
  }

  private async findExistingJobApplication(application: CreateJobApplicationRequest) {
    Logger.debug(`Searching for existing job application: ${application.company_name} - ${application.job_title}`);
    // Try to find existing job application for this period
    const existingApplication = await this.opportunityRepository.findOneMatchingOpportunity({
      type: OpportunityType.JOB_APPLICATION,
      cycle: this.currentCycle,
      title: application.job_title,
      company_name: application.company_name,
      posting_url: application.job_posting_url,
    });

    return existingApplication;
  }

  private async createNewJobApplication(application: CreateJobApplicationRequest) {
    Logger.debug(`Creating new job application for: ${application.company_name} - ${application.job_title}`);
    // Searches for company
    let company = await this.companyRepository.findOneMatchingCompany({
      name: application.company_name,
      website_url: application.company_website_url,
      linkedin_url: application.company_linkedin_url,
    });

    if (!company) {
      Logger.debug(`Company not found, creating new company: ${application.company_name}`);
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

    Logger.debug(`Created new job application with id: ${newJobApplication.id}`);
    return newJobApplication;
  }
}
