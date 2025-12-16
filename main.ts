import "@std/dotenv/load"
import { App, staticFiles } from "fresh"
import { define, type State } from "@/utils.ts"

export const app = new App<State>()
  .use(staticFiles())
  .use(define.middleware((ctx) => {
    console.log(`${ctx.req.method} ${ctx.req.url}`)
    return ctx.next()
  }))
  .fsRoutes()
