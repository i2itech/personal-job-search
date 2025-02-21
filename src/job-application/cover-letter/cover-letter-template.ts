import { GenerateCoverLetterRequest } from "../types";

const style = `<style>
    html {
    -webkit-print-color-adjust: exact;
    }
  body {
    font-family: 'Calibri', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    color: #000000;
    max-width: 800px;
    line-height: 1.25;
  }
</style>`;

export const generateCoverLetterTemplate = (request: GenerateCoverLetterRequest) => {
  const lines = request.cover_letter.split("\n\n");
  return `
${style}
<div>
${lines
  .map(
    (line) =>
      `<p>${line
        .split("\n")
        .map((l) => `<span>${l}</span>`)
        .join("\n<br />\n")}</p>`
  )
  .join("\n")}
</div>`;
};
