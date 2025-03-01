import { execSync } from "child_process";

export const onPreBuild = () => {
  console.log("Running function generation script: npm run generate:netlify...");

  try {
    execSync("npm run generate:netlify", { stdio: "inherit" });
    console.log("Function generation completed.");
  } catch (error) {
    console.error("Error running generate:netlify script:", error);
    process.exit(1); // Exit with error to stop the build if the script fails
  }
};

export const onSuccess = () => {
  console.log("Function generation completed.");
};

export const onError = (error) => {
  console.error("Error running generate:netlify script:", error);
  process.exit(1); // Exit with error to stop the build if the script fails
};
