import matter from "gray-matter"
import { join } from "node:path"
import { readdirSync, readFileSync } from "node:fs"
import process from "node:process"
import { createMarkedInstance } from "$lib/utils/marked"
import { toKebabCase } from "$lib/utils/toKebabCase"

const POSTS_PATH = join(process.cwd(), "posts")

const marked = createMarkedInstance()

export type PostMeta = {
  title: string
  description: string
  date: string
  tags: string[]
}

export type Post = PostMeta & {
  slug: string
  content: string
}

export default readdirSync(POSTS_PATH)
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => {
    const filePath = join(POSTS_PATH, fileName)
    const fileContent = readFileSync(filePath, "utf-8")

    const { data: attrs, content: body } = matter(fileContent)

    return {
      slug: toKebabCase(fileName.replace(".md", "")),
      title: attrs.title as string,
      description: attrs.description as string,
      date: attrs.date as string,
      tags: (attrs.tags as string[]) || [],
      content: marked.parse(body)
    } as Post
  })
  .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
