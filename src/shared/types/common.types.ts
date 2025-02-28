import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ExternalFileSchema = z
  .object({
    name: z.string(),
    url: z.string().describe("The Google Drive URL of the file"),
  })
  .openapi("ExternalFile");

export type ExternalFile = z.infer<typeof ExternalFileSchema>;

export const ErrorResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi("ErrorResponse");
