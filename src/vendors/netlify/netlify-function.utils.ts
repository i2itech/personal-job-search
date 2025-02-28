import { Context } from "@netlify/functions";

export function getFunctionParams(context: Context) {
  return context.params;
}

export async function getFunctionBody(req: Request) {
  const body = await req.json();
  return body;
}

export function getFunctionPath(req: Request, controllerPath: string) {
  let path = req.url;
  // Convert route pattern to regex pattern
  const routeRegex = getUrlMatchingRegex(controllerPath);
  // Changed to match from start but allow content after
  const match = path.match(new RegExp(`^.*${routeRegex.source}`));
  if (!match) {
    throw new Error("URL does not match the expected pattern");
  }

  path = path.replace(new RegExp(`^.*${routeRegex.source}`), "");

  return path;
}

export function getUrlMatchingRegex(path: string) {
  const routePattern = path
    .replace(/:[^/]+/g, "([^/]+)") // Convert :param to capture group
    .replace(/\//g, "\\/"); // Escape forward slashes

  return new RegExp(`^${routePattern}$`);
}
