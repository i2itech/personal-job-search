import { Context } from "@netlify/functions";

export function getFunctionParams(context: Context) {
  return context.params;
}

export async function getFunctionBody(req: Request) {
  const body = await req.json();
  return body;
}

export function getFunctionPath(req: Request, controllerPath: string) {
  const urlPath = new URL(req.url).pathname;
  let path = urlPath;
  const routeRegex = getUrlMatchingRegex(controllerPath);
  // Remove the greedy .* and just match from the start
  const match = path.match(new RegExp(`^${routeRegex.source}`));
  if (!match) {
    console.error("URL does not match the expected pattern. Are you sure the controller and method path are correct");
    console.error("controller path", controllerPath);
    console.error("request url path", urlPath);
    throw new Error("URL does not match the expected pattern. Are you sure the controller and method path are correct");
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
