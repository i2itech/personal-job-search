const style = `<style>
    html {
    -webkit-print-color-adjust: exact;
    }
  body {
    font-family: 'Calibri', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    color: #000000;
    max-width: 800px;
  }
  h1 {
    margin: 0 0 8px 0;
    color: #5BA7AE;
    text-align: center;
    font-size: 28px;
  }
  h2 {
    color: #5BA7AE;
    padding: 2px 0;
    background-color: #D3D3D3;
    width: 100%;
    margin: 0 0 4px 0;
    font-size: 16px;
  }
  h3 {
    color: #000000;
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  h4 {
    color: #000000;
    font-size: 13px;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  ul {
    margin: 0;
    padding-left: 12px;
  }
  li {
    margin-bottom: 4px;
  }
  .section {
    margin-bottom: 12px;
  }
  .contact-info {
    text-align: center;
    font-size: 13px;
  }
  .contact-info span:not(:last-child)::after {
    content: " | ";
  }
  .skill-set {
    margin-bottom: 4px;
  }
  .work-experience {
    margin-bottom: 8px;
  }
</style>`;

export default style;
