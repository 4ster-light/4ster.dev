import type { APIRoute } from "astro"
import { fetchProjects } from "../../lib/projects"

export const GET: APIRoute = async () => {
  const projects = await fetchProjects(globalThis.process?.env?.GH_API ?? "")
  return new Response(JSON.stringify({ projects }), {
    status: 200,
    headers: new Headers({ "Content-Type": "application/json" })
  })
}
