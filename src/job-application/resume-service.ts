import { OpportunityRepository } from "../shared/repositories/opportunity.repository";
import { PuppeteerClient } from "../vendors/puppeteer/puppeteer.client";
import { GenerateResumeRequest } from "./types";

export class ResumeService {
  constructor(private readonly opportunityRepository: OpportunityRepository = new OpportunityRepository()) {}

  async generateResume(request: GenerateResumeRequest) {
    const resume = await PuppeteerClient.createPDF("<h1>Hello, Puppeteer!</h1>");
    return resume;
  }
}
