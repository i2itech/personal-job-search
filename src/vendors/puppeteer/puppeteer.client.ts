import puppeteer from "puppeteer-core";
import appConfig from "../../app/config";
import chromium from "@sparticuz/chromium";

export class PuppeteerClient {
  async createPDF(html: string): Promise<Buffer> {
    const browser = await this.launchBrowser();
    try {
      // Add a small delay to ensure everything is rendered
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: "domcontentloaded" });

      const pdf = await page.pdf({
        format: "Letter",
        margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
      });

      return Buffer.from(pdf);
    } catch (error) {
      console.error("Error creating PDF");
      console.error(error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private async launchBrowser() {
    const executablePath = appConfig().puppeteer.chrome_path || (await chromium.executablePath());
    const args = [
      ...(appConfig().puppeteer.chrome_path ? [] : chromium.args),
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ];
    try {
      const browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args,
      });
      return browser;
    } catch (error) {
      console.error("Error creating browser");
      console.error(error);
      throw error;
    }
  }
}
