export interface JobApplicationConfig {
  current_cycle: string;
}

export type ImportJobApplicationRequest = {
  company_name: string;
  company_website_url: string;
  company_linkedin_url: string;
  job_title: string;
  job_description: string;
  job_posting_url: string;
  pay_type: string;
};
