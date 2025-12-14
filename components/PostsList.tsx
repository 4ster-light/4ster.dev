import type { Post } from "@/lib/posts.ts"
import PostMeta from "@/components/PostMeta.tsx"

interface Props {
  posts: Post[]
}

export default function PostsList({ posts }: Props) {
  return (
    <div class="space-y-5">
      {posts
        .filter((post) => !post["is-preview"])
        .map((post) => (
          <article
            key={post.slug}
            class="card card-border bg-base-100 hover:bg-base-200/40 transition-colors"
          >
            <div class="card-body p-5">
              <PostMeta post={post} />
              <p class="text-base-content/70 text-sm leading-relaxed">
                {post.description}
              </p>
            </div>
          </article>
        ))}
    </div>
  )
}
