import "reflect-metadata";
import dotenv from "dotenv";
import { ResumeService } from "./job-application/resume/resume.service";
import { UpsertResumeDetailsRequest } from "./job-application/types/dtos/job-application.dtos";
import appConfig from "./app/config";

dotenv.config({ path: ".env" });

const main = async () => {
  throw new Error("Not implemented");
};

main();
