import { z } from "zod";

export const ExternalFileSchema = z.object({
  name: z.string(),
  url: z.string().describe("The Google Drive URL of the file"),
});

export type ExternalFile = z.infer<typeof ExternalFileSchema>;
