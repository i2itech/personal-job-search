import config from "../../../app/config";
import { GenerateResumeRequest, ResumeWorkExperience } from "../../types";
import style from "./template.style";
export const generateResumeTemplate = (request: GenerateResumeRequest) => {
  const personalInfo = config.job_application.personal_info;
  return `
${style}
<div>
  <div class="section">
    <h1>${personalInfo.name}</h1>
    <div class="contact-info">
      <span>${personalInfo.phone}</span>
      <span>${personalInfo.email}</span>
      <span>${personalInfo.linkedin_url}</span>
      <span>${personalInfo.github_url}</span>
    </div>
  </div>
  <div class="section">
    <h2>Professional Summary:</h2>
    <div>${request.summary || ""}</div>
  </div>
  <div class="section">
    <h2>Skills and Tools:</h2>
    ${request.skill_sets?.map((skillSet) => `<div class="skill-set"><b><i>${skillSet.type}</i></b>: ${skillSet.skills.join(", ")}</div>`).join("") || ""}
  </div>
  <div class="section">
    <h2>Education:</h2>
    <div>
      <div><b>${personalInfo.education.school}</b> ${personalInfo.education.location}</div>
      <div>${personalInfo.education.degree}</div>
      <div>${personalInfo.education.minor}</div>
    </div>
  </div>
  <div class="section">
    <h2>Work Experience:</h2>
    ${request.work_experience?.map((workExperience) => generateWorkExperience(workExperience)).join("") || ""}
  </div>
</div>`;
};

const generateWorkExperience = (workExperience: ResumeWorkExperience) => {
  return `<div class="work-experience">
    <h3>${workExperience.company} | ${workExperience.role}</h3>
    <h4>${workExperience.location} | ${workExperience.start_date} - ${workExperience.end_date}</h4>
    <ul>
        <li><b>Key Technologies: </b>${workExperience.key_technologies.join(", ")}</li>
        ${workExperience.experiences.map((experience) => `<li>${experience}</li>`).join("\n")}
    </ul>
</div>`;
};
