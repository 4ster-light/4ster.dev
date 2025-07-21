export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  content: string
}

export type PostMeta = {
  title: string
  description: string
  date: string
  tags?: string[]
}
