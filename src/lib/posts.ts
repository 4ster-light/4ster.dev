import { extract } from "@std/front-matter/yaml"
import { join } from "@std/path"
import { createMarkedInstance } from "$lib/utils/marked"
import { toKebabCase } from "@std/text"

const POSTS_PATH = join(Deno.cwd(), "posts")

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

export default Deno.readDirSync(POSTS_PATH)
  .filter((file) => file.name.endsWith(".md"))
  .map((file) => {
    const filePath = join(POSTS_PATH, file.name)
    const fileContent = new TextDecoder().decode(Deno.readFileSync(filePath))

    const { attrs, body } = extract<PostMeta>(fileContent)

    return {
      slug: toKebabCase(file.name.replace(".md", "")),
      title: attrs.title as string,
      description: attrs.description as string,
      date: attrs.date as string,
      tags: (attrs.tags as string[]) || [],
      content: marked.parse(body)
    } as Post
  })
  .toArray()
  .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
