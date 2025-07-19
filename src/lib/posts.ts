import frontMatter from "front-matter"
import * as path from "@jsr/std__path"

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  content: string
}

let cachedPosts: Post[] | null = null

export function getPosts(): Post[] {
  if (cachedPosts) return cachedPosts

  const postsPath = /* path.join(Deno.cwd(), "posts") */ "./posts"
  if (!Deno.statSync(postsPath).isDirectory) return []

  const files = Deno.readDirSync(postsPath)
  const posts: Post[] = []

  for (const file of files) {
    if (!file.name.endsWith(".md")) continue

    const filePath = `${postsPath}/${file.name}`
    const fileContent = Deno.readTextFileSync(filePath)
    const { attributes, body } = frontMatter<{
      slug: string
      title: string
      description: string
      date: string
      tags?: string[]
    }>(fileContent)

    posts.push({
      slug: file.name.replace(".md", ""),
      title: attributes.title,
      description: attributes.description,
      date: attributes.date,
      tags: attributes.tags || [],
      content: body,
    })
  }

  posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
  cachedPosts = posts

  return posts
}

export const findPost = (slug: string): Post | undefined =>
  getPosts().find((post) => post.slug === slug)

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
