import { Context } from "@netlify/functions";

export function getFunctionParams(context: Context) {
  return context.params;
}

export async function getFunctionBody(req: Request) {
  const body = await req.json();
  return body;
}
