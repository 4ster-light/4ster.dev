// deno-lint-ignore-file no-external-import
import { defineCollection, z } from "astro:content"

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    "is-preview": z.boolean().optional().default(false),
    "header-image": z.boolean().optional().default(false)
  })
})

export const collections = {
  posts: postsCollection
}
