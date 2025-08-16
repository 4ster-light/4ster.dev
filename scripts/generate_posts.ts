import frontMatter from "front-matter"
import * as path from "@std/path"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { gfmHeadingId } from "marked-gfm-heading-id"
import hljs from "highlight.js"
import type { Post, PostMeta } from "../src/lib/types/post.d.ts"

const POSTS_PATH = path.join(Deno.cwd(), "posts")
const STATIC_PATH = path.join(Deno.cwd(), "static")

const marked = new Marked(
  gfmHeadingId(),
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, _) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    },
  }),
)

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
    content: await marked.parse(body),
  })
}

posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())

const jsonFilePath = path.join(STATIC_PATH, "posts.json")
Deno.writeTextFileSync(jsonFilePath, JSON.stringify(posts, null, 2))

console.log("\nPosts JSON file generated successfully\n")
