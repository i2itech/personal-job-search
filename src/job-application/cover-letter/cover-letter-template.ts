import { GenerateCoverLetterRequest } from "../types";

const style = `<style>
    html {
    -webkit-print-color-adjust: exact;
    }
  body {
    font-family: 'Calibri', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    color: #000000;
    max-width: 800px;
    line-height: 1.25;
  }
</style>`;

export const generateCoverLetterTemplate = (request: GenerateCoverLetterRequest) => {
  return `
${style}
<div>
  <pre>
  ${request.cover_letter}
  </pre>
</div>`;
};
