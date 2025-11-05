import appConfig from "../../app/config";
import { OpportunityRepository } from "../../shared/repositories/opportunity.repository";
import { formatString, removeSpecialCharacters, StringFormat } from "../../shared/utils";
import { GoogleDriveClient } from "../../vendors/google/drive/google-drive.client";
import { PuppeteerClient } from "../../vendors/puppeteer/puppeteer.client";
import { GenerateResumeRequest, UpsertResumeDetailsRequest } from "../types";
import { generateResumeTemplate } from "./resume-template";
import { ResumeDetailsRepository } from "../../shared/repositories/resume-details.repository";
import { getLogger } from "../../shared/logger.service";
import { ResumeDetailsEntity } from "../../shared/entities/resume-details.entity";
import { OpportunityEntity } from "../../shared/entities/opportunity.entity";

const logger = getLogger("ResumeService");
export class ResumeService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private readonly googleDriveClient: GoogleDriveClient = new GoogleDriveClient(),
    private readonly resumeDetailsRepository: ResumeDetailsRepository = new ResumeDetailsRepository(),
    private readonly puppeteerClient: PuppeteerClient = new PuppeteerClient()
  ) {}

  async generateResume(request: GenerateResumeRequest) {
    let resumeDetails = await this.resumeDetailsRepository.findOneByJobApplication(request.job_application_id);
    if (!resumeDetails) {
      logger.error("Resume details not found", JSON.stringify(resumeDetails, null, 2));
      throw new Error("Resume details not found");
    }
    if (!resumeDetails.summary || resumeDetails.summary.length === 0) {
      logger.error("Resume summary is empty", JSON.stringify(resumeDetails, null, 2));
      throw new Error("Resume summary is empty");
    }

    if (!resumeDetails.skill_sets || resumeDetails.skill_sets.length === 0) {
      logger.error("Resume skill sets are empty", JSON.stringify(resumeDetails, null, 2));
      throw new Error("Resume skill sets are empty");
    }

    if (
      !resumeDetails.work_experience ||
      !resumeDetails.work_experience.relevant ||
      resumeDetails.work_experience.relevant.length === 0
    ) {
      logger.error("Resume work experience is empty", JSON.stringify(resumeDetails, null, 2));
      throw new Error("Resume work experience is empty");
    }

    let opportunity = await this.opportunityRepository.findOneById(request.job_application_id);
    if (!opportunity) {
      logger.error("Opportunity not found", JSON.stringify(request, null, 2));
      throw new Error("Opportunity not found");
    }

    let resume: Buffer = await this.generateResumePDF(resumeDetails);
    let resumeFile = await this.uploadResumeToGoogleDrive(resume, opportunity);
    return this.updateOpportunityResume(request.job_application_id, resumeFile);
  }

  private async generateResumePDF(resumeDetails: ResumeDetailsEntity) {
    let resume: Buffer;
    try {
      const resumeTemplate = generateResumeTemplate(resumeDetails);
      resume = await this.puppeteerClient.createPDF(resumeTemplate);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate resume");
    }
    return resume;
  }

  private async uploadResumeToGoogleDrive(resume: Buffer, opportunity: OpportunityEntity) {
    let resumeFile: { id: string; name: string };
    try {
      const title = formatString(removeSpecialCharacters(opportunity.title), StringFormat.SNAKE_CASE);
      const companyName = formatString(
        removeSpecialCharacters(opportunity.company_name || ""),
        StringFormat.SNAKE_CASE
      );
      const timestamp = Date.now();
      const fileName = `${companyName}-${title}-${timestamp}.pdf`;

      resumeFile = await this.googleDriveClient.uploadFile({
        name: fileName,
        folderId: appConfig().job_application.google_drive.resume_folder_id,
        mimeType: "application/pdf",
        body: resume,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload resume");
    }

    return resumeFile;
  }

  private async updateOpportunityResume(job_application_id: string, resumeFile: { id: string; name: string }) {
    try {
      const resumeUrl = await this.googleDriveClient.getFileUrl(resumeFile.id);
      let opportunity = await this.opportunityRepository.updateOpportunity({
        id: job_application_id,
        resume: { url: resumeUrl, name: resumeFile.name },
      });

      return opportunity;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update opportunity");
    }
  }

  async upsertResumeDetails(request: UpsertResumeDetailsRequest) {
    const {
      job_application_id,
      details: { type, ...details },
    } = request;
    const opportunity = await this.opportunityRepository.findOneById(job_application_id);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const resumeDetails = await this.resumeDetailsRepository.upsert({ job_application_id, ...details });
    return resumeDetails;
  }
}
