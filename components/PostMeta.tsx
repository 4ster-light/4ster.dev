import type { Post } from "@/lib/posts.ts"

interface Props {
  post: Post
  header?: boolean
}

function PostTitle({ post, header }: Props) {
  return header
    ? <h1 class="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
    : (
      <h3 class="card-title text-lg m-0 mb-2">
        <a href={`/posts/${post.slug}`} class="link link-hover link-primary">
          {post.title}
        </a>
      </h3>
    )
}

function PostDate({ post }: { post: Post }) {
  return (
    <time datetime={post.date}>
      {new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })}
    </time>
  )
}

function PostTags({ post }: { post: Post }) {
  return (
    <div class="flex gap-2 flex-wrap">
      {post.tags?.length
        ? post.tags.map((tag) => (
          <span key={tag} class="badge badge-soft badge-info">
            {tag}
          </span>
        ))
        : <span class="badge badge-soft badge-info">UNCATEGORISED</span>}
    </div>
  )
}

export default function PostMeta({ post, header = false }: Props) {
  return (
    <section class="flex flex-col gap-4">
      <PostTitle post={post} header={header} />
      <div class="flex flex-col gap-8 md:gap-4 md:flex-row md:justify-between md:items-center">
        <PostDate post={post} />
        <PostTags post={post} />
      </div>
    </section>
  )
}
