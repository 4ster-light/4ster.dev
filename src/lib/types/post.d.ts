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
