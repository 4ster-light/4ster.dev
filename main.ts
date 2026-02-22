import "@std/dotenv/load"
import { App, staticFiles } from "fresh"
import { define, type State } from "@/utils.ts"

const logginMiddleware = define.middleware(async (ctx) => {
  console.log(`${ctx.req.method} ${ctx.req.url}`)
  return await ctx.next()
})

export const app = new App<State>()
  .use(staticFiles())
  .use(logginMiddleware)
  .fsRoutes()
