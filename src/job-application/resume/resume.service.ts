import appConfig from "../../app/config";
import { OpportunityRepository } from "../../shared/repositories/opportunity.repository";
import { formatString, removeSpecialCharacters, StringFormat } from "../../shared/utils";
import { GoogleDriveClient } from "../../vendors/google/drive/google-drive.client";
import { PuppeteerClient } from "../../vendors/puppeteer/puppeteer.client";
import { GenerateResumeRequest } from "../types";
import { generateResumeTemplate } from "./resume-template";

export class ResumeService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private googleDriveClient: GoogleDriveClient = new GoogleDriveClient()
  ) {}

  async generateResume(request: GenerateResumeRequest) {
    const opportunity = await this.opportunityRepository.findOneById(request.job_application_id);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    const resumeTemplate = generateResumeTemplate(request);
    const resume = await PuppeteerClient.createPDF(resumeTemplate);

    const title = formatString(removeSpecialCharacters(opportunity.title), StringFormat.SNAKE_CASE);
    const companyName = formatString(removeSpecialCharacters(opportunity.company_name || ""), StringFormat.SNAKE_CASE);
    const timestamp = Date.now();
    const resumeFile = await this.googleDriveClient.uploadFile({
      name: `${title}-${companyName}-${timestamp}.pdf`,
      folderId: appConfig.job_application.google_drive.resume_folder_id,
      mimeType: "application/pdf",
      body: resume,
    });

    const resumeUrl = await this.googleDriveClient.getFileUrl(resumeFile.id || "");
    await this.opportunityRepository.updateOpportunity({
      id: request.job_application_id,
      resume: resumeUrl || undefined,
    });

    return resume;
  }
}
