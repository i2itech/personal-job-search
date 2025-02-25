import appConfig from "../../app/config";
import { ResumeDetails, ResumeWorkExperience } from "../../shared/types";

const style = `<style>
    html {
    -webkit-print-color-adjust: exact;
    }
  body {
    font-family: 'Calibri', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    color: #000000;
    max-width: 800px;
  }
  h1 {
    margin: 0 0 8px 0;
    color: #2B666B;
    text-align: center;
    font-size: 28px;
  }
  h2 {
    color: #2B666B;
    padding: 2px 0;
    background-color: #D3D3D3;
    width: 100%;
    margin: 0 0 4px 0;
    font-size: 16px;
  }
  h3 {
    color: #000000;
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  h4 {
    color: #000000;
    font-size: 13px;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  ul {
    margin: 0;
    padding-left: 12px;
  }
  li {
    margin-bottom: 4px;
  }
  .section {
    margin-bottom: 12px;
  }
  .contact-info {
    text-align: center;
    font-size: 13px;
  }
  .contact-info span:not(:last-child)::after {
    content: " | ";
  }
  .skill-set {
    margin-bottom: 4px;
  }
  .work-experience {
    margin-bottom: 8px;
  }
</style>`;

export const generateResumeTemplate = (request: ResumeDetails) => {
  const personalInfo = appConfig().job_application.personal_info;
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
