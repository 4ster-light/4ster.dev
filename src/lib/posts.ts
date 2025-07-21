import * as path from "@jsr/std__path"
import type { Post } from "$lib/types/post"

let cachedPosts: Post[] | null = null

export function getPosts(): Post[] {
  if (cachedPosts) return cachedPosts

  let jsonFilePath: string
  import.meta.env.DEV
    ? jsonFilePath = path.join(Deno.cwd(), "static", "posts.json")
    : jsonFilePath = path.join(Deno.cwd(), "client", "posts.json")

  const jsonContent = Deno.readTextFileSync(jsonFilePath)
  cachedPosts = JSON.parse(jsonContent) as Post[]

  return cachedPosts
}

export const findPost = (slug: string): Post | undefined =>
  getPosts().find((post) => post.slug === slug)

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
