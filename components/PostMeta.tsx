import type { Post } from "@/lib/content/posts.ts"

interface Props {
  post: Post
  header?: boolean
}

export default function PostMeta({ post, header = false }: Props) {
  return (
    <header class={`flex flex-col ${header ? "gap-4" : "gap-2 border-l-2 border-primary pl-4"}`}>
      {/* Title */}
      {header
        ? <h1 class="text-3xl md:text-4xl font-bold">{post.title}</h1>
        : (
          <a href={`/posts/${post.slug}`} class="link link-hover link-primary">
            <h3 class="text-lg">{post.title}</h3>
          </a>
        )}
      {/* Description */}
      <p class="text-base-content/70 text-sm leading-relaxed">{post.description}</p>
      {/* Date */}
      <time datetime={post.date}>
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })}
      </time>
      {/* Tags */}
      <div class="flex gap-2 flex-wrap m-0">
        {post.tags?.length
          ? (
            post.tags.map((tag) => (
              <span key={tag} class="badge badge-soft badge-info">
                {tag}
              </span>
            ))
          )
          : <span class="badge badge-soft badge-info">UNCATEGORISED</span>}
      </div>
    </header>
  )
}
