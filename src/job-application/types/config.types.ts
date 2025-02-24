export interface JobApplicationConfig {
  current_cycle: string;
  personal_info: JobApplicationPersonalInfo;
  google_drive: {
    cover_letter_folder_id: string;
    resume_folder_id: string;
  };
}

export interface JobApplicationPersonalInfo {
  name: string;
  phone: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  education: JobApplicationEducation;
}

export type JobApplicationEducation = {
  school: string;
  location: string;
  degree: string;
  minor: string;
};
