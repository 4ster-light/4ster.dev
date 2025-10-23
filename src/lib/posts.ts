import matter from "gray-matter"
import { join } from "node:path"
import { readdirSync, readFileSync } from "node:fs"
import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { gfmHeadingId } from "marked-gfm-heading-id"
import hljs from "highlight.js"
import process from "node:process"

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

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

const POSTS_PATH = join(process.cwd(), "posts")

const marked = new Marked(
  gfmHeadingId(),
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, _) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext"
      return hljs.highlight(code, { language }).value
    }
  })
)

const posts: Post[] = []

const files = readdirSync(POSTS_PATH)

for (const fileName of files) {
  if (!fileName.endsWith(".md")) continue

  const filePath = join(POSTS_PATH, fileName)
  const fileContent = readFileSync(filePath, "utf-8")

  const { data: attrs, content: body } = matter(fileContent)

  posts.push({
    slug: toKebabCase(fileName.replace(".md", "")),
    title: attrs.title as string,
    description: attrs.description as string,
    date: attrs.date as string,
    tags: (attrs.tags as string[]) || [],
    content: await marked.parse(body)
  })
}

posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())

export default posts
