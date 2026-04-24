import type { APIRoute } from "astro"
import { fetchProjectsCached } from "../../lib/projects.ts"

export const GET: APIRoute = async () => {
  const projects = await fetchProjectsCached(Deno.env.get("GH_API") || "")
  return new Response(JSON.stringify({ projects }), {
    status: 200,
    headers: new Headers({ "Content-Type": "application/json" })
  })
}
