import { findPost } from "$lib/posts"
import type { Post } from "$lib/types/post"
import { error } from "@sveltejs/kit"

export function load({ params }: {
  params: {
    slug: string
  }
}): {
  post: Post
} {
  const post = findPost(params.slug)

  if (!post) throw error(404, "Post not found")

  return {
    post: {
      ...post,
      content: post.content,
    },
  }
}
