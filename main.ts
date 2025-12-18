import "@std/dotenv/load"
import { App, staticFiles } from "fresh"
import { define, type State } from "@/utils.ts"

const logginMiddleware = define.middleware(async (ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`)
  return await ctx.next()
})

export const cacheHeadersMiddleware = define.middleware(async (ctx) => {
  const response = await ctx.next()
  response.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1800")
  return response
})

export const app = new App<State>()
  .use(staticFiles())
  .use(logginMiddleware)
  .use(cacheHeadersMiddleware)
  .fsRoutes()
