import type { Post } from "@/lib/content/posts.ts"
import type { TocItem } from "@/lib/toc.ts"

interface TocSidebarProps {
  items: TocItem[]
  recentPosts?: Post[]
}

export default function TocSidebar({ items, recentPosts }: TocSidebarProps) {
  return (
    <aside class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-8">
      {items.length > 0 && (
        <nav class="space-y-2">
          <h2 class="text-xs font-semibold text-base-content/70 uppercase tracking-widest mb-4">
            On this page
          </h2>
          <ul class="space-y-2">
            {items.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
                <a href={`#${item.id}`} class="link link-hover text-sm">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {recentPosts && recentPosts.length > 0 && (
        <>
          {items.length > 0 && <div class="divider my-4" />}
          <nav class="space-y-2">
            <h2 class="text-xs font-semibold text-base-content/70 uppercase tracking-widest mb-4">
              Recent Posts
            </h2>
            <ul class="space-y-3">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <a href={`/posts/${post.slug}`} class="link text-sm block text-primary">
                    {post.title}
                  </a>
                  <span class="text-xs text-base-content/50">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </aside>
  )
}
