#!/usr/bin/env node
import { generateNetlifyFunctions } from "../vendors/netlify/cli/generate-netlify-functions";
import { ALL_CONTROLLERS } from "../app/app.module";

async function main() {
  try {
    // Get controllers from AppModule
    const controllers = ALL_CONTROLLERS;

    await generateNetlifyFunctions({
      functionsDir: "netlify/functions",
      controllers,
    });
  } catch (error) {
    console.error("Error generating Netlify functions:", error);
    process.exit(1);
  }
}

main();
