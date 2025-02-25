import puppeteer from "puppeteer-core";
import appConfig from "../../app/config";
import chromium from "@sparticuz/chromium";

export class PuppeteerClient {
  static async createPDF(html: string): Promise<Buffer> {
    const executablePath = appConfig().puppeteer.chrome_path || (await chromium.executablePath());
    console.info("executablePath", executablePath);
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      // Add a small delay to ensure everything is rendered
      const page = await browser.newPage();
      console.info("New Page Created");

      await page.setContent(html, { waitUntil: "load" });

      console.info("Set Content");
      const pdf = await page.pdf({
        format: "Letter",
        margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      });

      console.info("PDF Created");
      return Buffer.from(pdf);
    } catch (error) {
      console.error("Error creating PDF");
      console.error(error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
