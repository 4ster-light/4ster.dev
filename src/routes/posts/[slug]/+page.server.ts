import { findPost, type Post } from "$lib/posts"
import { error } from "@sveltejs/kit"
import { marked } from "marked"

export async function load({ params }: {
  params: {
    slug: string
  }
}): Promise<{
  post: Post
}> {
  const post = findPost(params.slug)

  if (!post) throw error(404, "Post not found")

  return {
    post: {
      ...post,
      content: await marked(post.content),
    },
  }
}
