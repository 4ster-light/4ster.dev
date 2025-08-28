import { extract } from "@std/front-matter/yaml"
import { join } from "@std/path"
import { toKebabCase } from "@std/text"

import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { gfmHeadingId } from "marked-gfm-heading-id"
import hljs from "highlight.js"

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

const POSTS_PATH = join(Deno.cwd(), "posts")

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

for await (const file of Deno.readDir(POSTS_PATH)) {
  if (!file.name.endsWith(".md")) continue

  const filePath = join(POSTS_PATH, file.name)
  const fileContent = await Deno.readTextFile(filePath)

  const { attrs, body } = extract<PostMeta>(fileContent)

  posts.push({
    slug: toKebabCase(file.name.replace(".md", "")),
    title: attrs.title as string,
    description: attrs.description as string,
    date: attrs.date as string,
    tags: (attrs.tags as string[]) || [],
    content: await marked.parse(body),
  })
}

posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())

export default posts
