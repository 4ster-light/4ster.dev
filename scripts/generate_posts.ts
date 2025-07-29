import frontMatter from "front-matter"
import * as path from "@std/path"
import { marked } from "marked"

import type { Post, PostMeta } from "../src/lib/types/post.d.ts"

const POSTS_PATH = path.join(Deno.cwd(), "posts")
const STATIC_PATH = path.join(Deno.cwd(), "static")

const posts: Post[] = []

for (const file of Deno.readDirSync(POSTS_PATH)) {
  if (!file.name.endsWith(".md")) continue
  const filePath = path.join(POSTS_PATH, file.name)
  const fileContent = Deno.readTextFileSync(filePath)
  const { attributes, body } = frontMatter<PostMeta>(fileContent)
  posts.push({
    slug: file.name.replace(".md", ""),
    title: attributes.title,
    description: attributes.description,
    date: attributes.date,
    tags: attributes.tags || [],
    content: await marked(body),
  })
}

posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())

const jsonFilePath = path.join(STATIC_PATH, "posts.json")
Deno.writeTextFileSync(jsonFilePath, JSON.stringify(posts, null, 2))

console.log("\nPosts JSON file generated successfully\n")
