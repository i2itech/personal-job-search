import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { PuppeteerClient } from "../vendors/puppeteer/puppeteer.client";
import { GenerateResumeRequest } from "./types";
import { generateResumeTemplate } from "./resume/template/template";
export class ResumeService {
  constructor(private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository()) {}

  async generateResume(request: GenerateResumeRequest) {
    const resumeTemplate = generateResumeTemplate(request);
    const resume = await PuppeteerClient.createPDF(resumeTemplate);
    return resume;
  }
}
