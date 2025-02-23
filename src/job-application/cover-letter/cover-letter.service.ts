import appConfig from "../../app/config";
import { OpportunityRepository } from "../../shared/repositories/opportunity.repository";
import { formatString, removeSpecialCharacters, StringFormat } from "../../shared/utils";
import { GoogleDriveClient } from "../../vendors/google/drive/google-drive.client";
import { PuppeteerClient } from "../../vendors/puppeteer/puppeteer.client";
import { GenerateCoverLetterRequest } from "../types";
import { generateCoverLetterTemplate } from "./cover-letter-template";

export class CoverLetterService {
  constructor(
    private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository(),
    private googleDriveClient: GoogleDriveClient = new GoogleDriveClient()
  ) {}

  async generate(request: GenerateCoverLetterRequest) {
    let opportunity = await this.opportunityRepository.findOneById(request.job_application_id);
    if (!opportunity) {
      throw new Error("Opportunity not found");
    }

    let coverLetter: Buffer;
    try {
      const coverLetterTemplate = generateCoverLetterTemplate(request);
      coverLetter = await PuppeteerClient.createPDF(coverLetterTemplate);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate cover letter");
    }

    let coverLetterFile: { id: string; name: string };
    try {
      const title = formatString(removeSpecialCharacters(opportunity.title), StringFormat.SNAKE_CASE);
      const companyName = formatString(
        removeSpecialCharacters(opportunity.company_name || ""),
        StringFormat.SNAKE_CASE
      );
      const timestamp = Date.now();
      const fileName = `${companyName}-${title}-${timestamp}.pdf`;

      coverLetterFile = await this.googleDriveClient.uploadFile({
        name: fileName,
        folderId: appConfig.job_application.google_drive.cover_letter_folder_id,
        mimeType: "application/pdf",
        body: coverLetter,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to upload resume");
    }

    try {
      const coverLetterUrl = await this.googleDriveClient.getFileUrl(coverLetterFile.id);
      opportunity = await this.opportunityRepository.updateOpportunity({
        id: request.job_application_id,
        cover_letter: { url: coverLetterUrl, name: coverLetterFile.name },
      });

      return opportunity;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update opportunity");
    }
  }
}
