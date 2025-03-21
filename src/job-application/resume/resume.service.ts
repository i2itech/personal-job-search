import appConfig from "../../app/config";
import { OpportunityRepository } from "../../shared/repositories/opportunity.repository";
import { formatString, removeSpecialCharacters, StringFormat } from "../../shared/utils";
import { GoogleDriveClient } from "../../vendors/google/drive/google-drive.client";
import { PuppeteerClient } from "../../vendors/puppeteer/puppeteer.client";
import { GenerateResumeRequest, UpsertResumeDetailsRequest } from "../types";
import { generateResumeTemplate } from "./resume-template";
import { ResumeDetailsRepository } from "../../shared/repositories/resume-details.repository";
export class ResumeService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private readonly googleDriveClient: GoogleDriveClient = new GoogleDriveClient(),
    private readonly resumeDetailsRepository: ResumeDetailsRepository = new ResumeDetailsRepository(),
    private readonly puppeteerClient: PuppeteerClient = new PuppeteerClient()
  ) {}

  async generateResume(request: GenerateResumeRequest) {
    let resumeDetails = await this.resumeDetailsRepository.findOneByJobApplication(request.job_application_id);
    if (!resumeDetails || !resumeDetails.summary || resumeDetails.skill_sets.length === 0) {
      console.error("Resume details not found", JSON.stringify(resumeDetails, null, 2));
      throw new Error("Resume details not found");
    }

    console.log("resumeDetails", JSON.stringify(resumeDetails, null, 2));

    if (resumeDetails.work_experience && Array.isArray(resumeDetails.work_experience)) {
      resumeDetails.work_experience = {
        relevant: resumeDetails.work_experience,
      };
    }

    let opportunity = await this.opportunityRepository.findOneById(request.job_application_id);
    if (!opportunity) {
      console.error("Opportunity not found");
      throw new Error("Opportunity not found");
    }

    let resume: Buffer;
    try {
      const resumeTemplate = generateResumeTemplate(resumeDetails);
      resume = await this.puppeteerClient.createPDF(resumeTemplate);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate resume");
    }

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

    try {
      const resumeUrl = await this.googleDriveClient.getFileUrl(resumeFile.id);
      opportunity = await this.opportunityRepository.updateOpportunity({
        id: request.job_application_id,
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
