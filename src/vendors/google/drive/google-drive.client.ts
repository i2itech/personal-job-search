import { JWT } from "google-auth-library";
import { google } from "googleapis";
import appConfig from "../../../app/config";
import { GoogleDriveConfig } from "./google-drive.type";
import { Readable } from "stream";
export class GoogleDriveClient {
  private driveClient;

  constructor(config: GoogleDriveConfig = appConfig().google.drive) {
    if (!config.credentials || !config.credentials.private_key || !config.credentials.client_email) {
      throw new Error("Invalid Google Drive credentials. Please check your environment variables.");
    }

    const auth = new JWT({
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    auth.fromJSON(config.credentials);

    this.driveClient = google.drive({ version: "v3", auth: auth });
  }

  async uploadFile(file: {
    name: string;
    folderId: string;
    mimeType: string;
    body: string | Buffer | NodeJS.ReadableStream;
  }): Promise<{ id: string; name: string }> {
    if (typeof file.body === "string") {
      file.body = Buffer.from(file.body);
    }

    if (Buffer.isBuffer(file.body)) {
      const stream = new Readable();
      stream.push(file.body);
      stream.push(null);
      file.body = stream;
    }

    try {
      const fileMetadata = {
        name: file.name,
        parents: [file.folderId],
      };
      const media = {
        mimeType: file.mimeType,
        body: file.body,
      };
      const response = await this.driveClient.files.create({
        requestBody: fileMetadata,
        media: media,
      });

      if (!response.data.id) {
        throw new Error("Failed to upload file");
      }

      return { id: response.data.id, name: response.data.name || file.name };
    } catch (error: any) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    const response = await this.driveClient.files.get({ fileId, fields: "webViewLink" });
    if (!response.data.webViewLink) {
      throw new Error("File not found");
    }
    return response.data.webViewLink;
  }
}
