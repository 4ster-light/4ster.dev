import frontMatter from "front-matter"
import * as path from "@jsr/std__path"
import type { Post } from "../src/lib/types/post"

const postsPath = path.join(Deno.cwd(), "posts")
const staticPath = path.join(Deno.cwd(), "static")
const posts: Post[] = []

for (const file of Deno.readDirSync(postsPath)) {
  if (!file.name.endsWith(".md")) continue

  const filePath = path.join(postsPath, file.name)
  const fileContent = Deno.readTextFileSync(filePath)
  const { attributes, body } = frontMatter<{
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

const jsonFilePath = path.join(staticPath, "posts.json")
Deno.writeTextFileSync(jsonFilePath, JSON.stringify(posts, null, 2))

console.log("\nPosts JSON file generated successfully\n")
