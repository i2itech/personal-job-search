import "reflect-metadata";
import fs from "fs-extra";
import path from "path";
import { getNetlifyFunctionHttpControllerMetadata } from "../decorators";
import { FunctionConfig, generateNetlifyFunctionContent } from "./netlify-function.template";

interface GenerateNetlifyFunctionsOptions {
  functionsDir: string;
  controllers: any[];
}

// Find the path of every file in the src directory ending with .controller.ts
const findControllerFiles = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir);
  const controllerFiles: string[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      const nestedFiles = await findControllerFiles(filePath);
      controllerFiles.push(...nestedFiles);
    } else if (file.endsWith(".controller.ts")) {
      controllerFiles.push(filePath);
    }
  }

  return controllerFiles;
};

async function generateNetlifyFunctions(options: GenerateNetlifyFunctionsOptions) {
  const { functionsDir, controllers } = options;

  // Ensure functions directory exists and is empty
  await fs.emptyDir(functionsDir);

  const functionConfigs: FunctionConfig[] = [];

  // Find the path of every file in the src directory ending with .controller.ts
  const controllerFiles = await findControllerFiles(path.join(process.cwd(), "src"));

  // Process each controller
  for (const Controller of controllers) {
    const controllerMetadata = getNetlifyFunctionHttpControllerMetadata(Controller);
    const controllerPath = await getControllerPath(Controller, controllerFiles, functionsDir);

    const uniquePaths = new Set<string>();
    Object.entries(controllerMetadata.httpMethodFunctions || {}).map(([_, methodMetaData]) => {
      const fullPath = `${controllerMetadata.path}${methodMetaData.path ? methodMetaData.path : ""}`;
      uniquePaths.add(fullPath);
    });

    // Generate function for base controller path
    for (const fullPath of uniquePaths) {
      const functionName = generateFunctionName(fullPath);
      functionConfigs.push({
        fileName: functionName,
        httpPath: fullPath,
        controllerPath,
      });
    }
  }

  // Generate function files
  for (const config of functionConfigs) {
    await generateFunctionFile(config, functionsDir);
  }
}

function generateFunctionName(path: string): string {
  return path
    .replace(/api\/v\d+\//, "") // Remove api/v1/
    .replace(/\//g, "_") // Replace / with underscore
    .replace(/\./g, "_") // Replace . with underscore
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores
    .toLowerCase();
}

function getClassFileLocation(cls: Function): string | null {
  const err = new Error();
  const stack = err.stack?.split("\n") || [];

  for (const line of stack) {
    if (line.includes(cls.name)) {
      const match = line.match(/\(([^)]+)\)/);
      if (match) return match[1]; // Extracts the file path
    }
  }

  return null;
}

async function getControllerPath(Controller: any, controllerFiles: string[], functionsDir: string): Promise<string> {
  try {
    // Access the internal FunctionLocation property
    const className = Controller.name;
    const searchString = `class ${className}`;

    // Check contents  of each controller file to see if it contains the className
    let sourceFile: string | null = null;
    for (const file of controllerFiles) {
      const fileContents = await fs.readFile(file, "utf8");
      if (fileContents.includes(searchString)) {
        sourceFile = file;
        break;
      }
    }

    if (!sourceFile) {
      throw new Error(`Could not find source file for ${Controller.name}`);
    }

    // Convert absolute path to relative path from netlify/functions directory
    const netlifyFunctionsDir = path.resolve(functionsDir);
    const relativePath = path
      .relative(netlifyFunctionsDir, sourceFile)
      .replace(/\\/g, "/") // Convert Windows paths to forward slashes
      .replace(/\.(ts|js|mts|mjs)$/, ""); // Remove extension

    return relativePath;
  } catch (error) {
    // Fallback: Try to infer path from controller name
    const inferredPath = `../../controllers/${Controller.name.toLowerCase()}.controller`;
    console.warn(`Warning: Could not resolve path for ${Controller.name}, using inferred path: ${inferredPath}`);
    return inferredPath;
  }
}

async function generateFunctionFile(config: FunctionConfig, functionsDir: string) {
  const content = generateNetlifyFunctionContent(config);
  const functionPath = path.join(functionsDir, `${config.fileName}.mts`);

  await fs.writeFile(functionPath, content, "utf-8");
}

export { generateNetlifyFunctions };
