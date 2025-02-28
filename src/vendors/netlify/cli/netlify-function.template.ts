export interface FunctionConfig {
  fileName: string;
  httpPath: string;
  controllerPath: string;
}

export function generateNetlifyFunctionContent(config: FunctionConfig) {
  return `\
import { Config, Context } from "@netlify/functions";
import Controller from "${config.controllerPath}";

export const config: Config = {
  path: "${config.httpPath}"
};

export default async (req: Request, context: Context) => {
  const controller = new Controller();
  return controller.handler(req, context);
};
`;
}
