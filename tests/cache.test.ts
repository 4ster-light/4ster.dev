// deno-lint-ignore-file no-explicit-any

import { assertEquals } from "@std/assert"
import { cacheHeadersMiddleware } from "@/main.ts"

Deno.test("Cache Headers Middleware", async (t) => {
  await t.step("sets correct cache headers", async () => {
    const mockCtx: any = {
      next: () => {
        return new Response("test content")
      }
    }

    const response = await cacheHeadersMiddleware(mockCtx)

    assertEquals(
      response.headers.get("Cache-Control"),
      "public, s-maxage=600, stale-while-revalidate=1800"
    )
  })

  await t.step("preserves response body", async () => {
    const mockCtx: any = {
      next: () => {
        return new Response("test content")
      }
    }

    const result = await cacheHeadersMiddleware(mockCtx)
    const body = await result.text()

    assertEquals(body, "test content")
  })

  await t.step("preserves existing headers", async () => {
    const mockCtx: any = {
      next: () => {
        const response = new Response("test content")
        response.headers.set("Content-Type", "application/json")
        return response
      }
    }

    const result = await cacheHeadersMiddleware(mockCtx)

    assertEquals(result.headers.get("Content-Type"), "application/json")
    assertEquals(
      result.headers.get("Cache-Control"),
      "public, s-maxage=600, stale-while-revalidate=1800"
    )
  })

  await t.step("handles errors from next()", async () => {
    const mockCtx: any = {
      next: () => {
        throw new Error("Test error")
      }
    }

    await cacheHeadersMiddleware(mockCtx).catch((err) => {
      assertEquals(err.message, "Test error")
    })
  })
})
