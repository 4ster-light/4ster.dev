import { define } from "@/utils.ts"
import { invalidate, invalidateAll } from "@/lib/cache.ts"

type CacheKey = "posts" | "repositories" | "all"

const VALID_KEYS: CacheKey[] = ["posts", "repositories", "all"]

export const handler = define.handlers({
  async POST(ctx) {
    const secret = Deno.env.get("CACHE_SECRET")
    if (!secret) {
      console.error("[cache/clear] CACHE_SECRET not configured")
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    const auth = ctx.req.headers.get("Authorization")
    if (!auth || auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      })
    }

    const body = await ctx.req.json().catch(() => null)
    const key = body?.key as CacheKey | undefined

    if (!key || !VALID_KEYS.includes(key)) {
      return new Response(
        JSON.stringify({ error: "Invalid key", valid: VALID_KEYS }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    if (key === "all") {
      const count = await invalidateAll()
      return new Response(
        JSON.stringify({ cleared: "all", count }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    }

    await invalidate(key)
    return new Response(
      JSON.stringify({ cleared: key }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  }
})
