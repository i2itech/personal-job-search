import { Context } from "@netlify/functions";

export function getFunctionParams(context: Context) {
  return context.params;
}

export function getFunctionBody(req: Request) {
  const body = req.json();
  return body;
}
