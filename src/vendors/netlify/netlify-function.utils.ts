import { Context } from "@netlify/functions";

export function getFunctionParams(context: Context) {
  return context.params;
}

export async function getFunctionBody(req: Request) {
  const body = await req.json();
  return body;
}

export function getFunctionPath(req: Request, controllerPath: string) {
  let path = new URL(req.url).pathname;
  const routeRegex = getUrlMatchingRegex(controllerPath);
  // Remove the greedy .* and just match from the start
  console.log("path", path, routeRegex.source);
  const match = path.match(new RegExp(`^${routeRegex.source}`));
  if (!match) {
    throw new Error("URL does not match the expected pattern");
  }

  path = path.replace(new RegExp(`^${routeRegex.source}`), "");
  return path;
}

export function getUrlMatchingRegex(path: string) {
  const routePattern = path
    .replace(/:[^/]+/g, "([^/]+)") // Convert :param to capture group
    .replace(/\//g, "\\/"); // Escape forward slashes

  return new RegExp(routePattern);
}
