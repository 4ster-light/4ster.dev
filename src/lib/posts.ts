import matter from "gray-matter"
import * as path from "@jsr/std__path"

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  content: string
}

export function getPosts(): Post[] {
  const postsPath = path.join(Deno.cwd(), "src", "posts")

  if (!Deno.statSync(postsPath).isDirectory) return []

  const files = Deno.readDirSync(postsPath)
  const posts: Post[] = []

  for (const file of files) {
    if (!file.name.endsWith(".md")) continue

    const filePath = `${postsPath}/${file.name}`
    const fileContent = Deno.readTextFileSync(filePath)
    const { data, content } = matter(fileContent)

    posts.push({
      slug: file.name.replace(".md", ""),
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      content,
    })
  }

  posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())

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
