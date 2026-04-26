import type { APIRoute } from "astro"
import { fetchProjects } from "../../lib/projects.ts"
import process from "node:process"

export const GET: APIRoute = async () => {
  const projects = await fetchProjects(process.env.GH_API || "")
  return new Response(JSON.stringify({ projects }), {
    status: 200,
    headers: new Headers({ "Content-Type": "application/json" })
  })
}
