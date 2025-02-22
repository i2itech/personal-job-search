import puppeteer from "puppeteer-core";
import appConfig from "../../app/config";

export class PuppeteerClient {
  static async createPDF(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      executablePath: appConfig.puppeteer.chrome_path,
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: "Letter",
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    });
    await browser.close();
    return Buffer.from(pdf);
  }
}
