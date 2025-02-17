import appConfig from "../app/config";
import { OpportunityType } from "../shared/entities/opportunity.entity";
import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { ImportJobApplicationRequest } from "./types";

export class JobApplicationService {
  private currentPeriod: string = appConfig.job_application.current_cycle;

  constructor(private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository()) {}

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

  private findExistingJobApplication(application: ImportJobApplicationRequest) {
    // Try to find existing job application for this period
    const existingApplication = this.opportunityRepository.findMatchingOpportunity({
      type: OpportunityType.JOB_APPLICATION,
      cycle: this.currentPeriod,
      title: application.job_title,
      company_name: application.company_name,
      posting_url: application.job_posting_url,
    });

    return existingApplication;
  }

  private createNewJobApplication(application: ImportJobApplicationRequest) {
    // Create a new job application
  }
}
