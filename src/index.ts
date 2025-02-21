import "dotenv/config";
import { JobApplicationService } from "./job-application/job-application.service";
import { ResumeService } from "./job-application/resume/resume.service";
import { GenerateResumeRequest, ResumeSkillSetType } from "./job-application/types";

const jobApplicationService = new JobApplicationService();

const main = async () => {
  const resume = await tryResume();
  console.log(resume);
};

const tryJobApplication = async () => {
  const jobApplicationService = new JobApplicationService();
  const jobApplication = await jobApplicationService.import({
    company_name: "Trilogy",
    job_title: "AI Super Engineer",
  });
};

const tryResume = async () => {
  const resumeService = new ResumeService();
  const generateResumeRequest: GenerateResumeRequest = {
    job_application_id: "19f89768-cbfe-8130-a838-f9d6333ce097",
    summary:
      "Accomplished software engineer with 15+ years of experience, known for driving innovation in the tech sector, especially within Fortune 500 companies. My recent projects have leveraged generative AI to enhance software development, demonstrating my ability to integrate emerging technologies seamlessly into practical, efficient solutions. Proficient in the full software development lifecycle, I excel in agile environments, embodying a collaborative ethos while delivering high-quality software solutions. My commitment to continuous improvement and ability to adapt to the latest technological advancements highlight my role as a dynamic contributor to any engineering team.",
    skill_sets: [
      {
        order: 1,
        type: ResumeSkillSetType.PROFESSIONAL_EXPERTISE,
        skills: [
          "Full Stack Development",
          "Software Architecture",
          "Software Design Patterns",
          "Agile and SCRUM Practices",
          "Development Operations",
          "Technical Documentation",
          "AI-Driven Development",
          "Cross-Functional Teams",
        ],
      },
      {
        order: 2,
        type: ResumeSkillSetType.LANGUAGES,
        skills: ["C#", "SQL", "JavaScript", "TypeScript", "HTML5", "CSS", "Python (Intermediate)", "Shell Script"],
      },
      {
        order: 3,
        type: ResumeSkillSetType.FRONTEND,
        skills: [
          "Angular 2-11",
          "ReactJS",
          "NextJs",
          "Socket.io",
          "Vite",
          "Tailwind",
          "MUI",
          "Bootstrap",
          "XState",
          "Storybook",
        ],
      },
      {
        order: 4,
        type: ResumeSkillSetType.BACKEND,
        skills: [
          ".NET (2.0 – 6, Core)",
          "NodeJs",
          "FastAPI",
          "NestJs",
          "Express",
          "TS.Ed",
          "TypeORM",
          "Mongoose",
          "REST",
          "GraphQL",
          "BullMQ",
        ],
      },
      {
        order: 5,
        type: ResumeSkillSetType.AI_LLM,
        skills: ["OpenAI SDK", "Anthropic AI SDK", "LangChain", "Pinecone"],
      },
      {
        order: 6,
        type: ResumeSkillSetType.DATA_STORAGE,
        skills: ["SQL Server", "PostgreSQL", "MySql", "SQLLite", "DB2", "MongoDB", "Redis"],
      },
      {
        order: 7,
        type: ResumeSkillSetType.DEVOPS_AND_MONITORING,
        skills: ["Git Actions", "Circle CI", "Azure DevOps", "Sentry", "Better Stack"],
      },
      {
        order: 8,
        type: ResumeSkillSetType.AZURE,
        skills: [
          "App Service",
          "Api Gateway",
          "Cognitive Search",
          "DevOps",
          "Functions",
          "Logic Apps",
          "Service Fabric",
          "Azure SQL",
          "Active Directory",
        ],
      },
      {
        order: 9,
        type: ResumeSkillSetType.AWS,
        skills: [
          "Lambda",
          "Step Function",
          "App Sync",
          "Glue",
          "S3",
          "Cognito",
          "CloudFormation",
          "DynamoDB",
          "DocumentDB",
          "RDS",
          "SNS/SQS",
        ],
      },
      {
        order: 10,
        type: ResumeSkillSetType.DEVELOPMENT_TOOLS,
        skills: [
          "Visual Code",
          "Cursor.sh",
          "Visual Studio",
          "Web Storm",
          "ChatGPT",
          "Github Copilot",
          "Github",
          "JIRA",
          "Postman",
        ],
      },
      {
        order: 11,
        type: ResumeSkillSetType.OTHERS,
        skills: ["Heroku", "Digital Ocean: App Platform", "Kubernetes Service", "Twilio API"],
      },
    ],
    work_experience: [
      {
        order: 1,
        company: "Solace.Health",
        role: "Senior Full Stack Engineer",
        location: "Remote",
        start_date: "June 2024",
        end_date: "February 2025",
        key_technologies: [
          "ReactJs",
          "NestJs",
          "TypeORM",
          "PostgreSQL",
          "Redis",
          "XState",
          "BullMQ",
          "Twilio",
          "OpenAI SDK",
          "Anthropic AI SDK",
          "Auth0",
        ],
        experiences: [
          "Led the integration of Twilio voice services with a third-party video platform using SIP integration to enhance user call experience",
          "Redesigned the prospective user onboarding flow using XState, improving the stability and clarity of the signup process",
          "Developed an AI-powered transcript summary feature using LLM services, implementing self-reflection techniques to enhance output consistency",
          "Built an AI chatbot using large language model SDKs to empower users with automated support and conversational guidance",
          "Improved developer efficiency by creating githook scripts, VSCode launch configurations, and optimizing CI/CD workflows",
          "Conducted technical spikes to evaluate third-party video conferencing tools, voice integrations, and chatbot frameworks",
          "Collaborated with PMs and Product Owners to refine feature requirements",
          "Shared knowledge across the team by leading presentations on in-house engineering improvements",
          "Managed deployments and monitored observability channels",
        ],
      },
      // ... rest of the work experience entries remain the same ...
    ],
  };
  const resume = await resumeService.generateResume(generateResumeRequest);
};

main();
