import type { TocItem } from "@/lib/toc.ts"

interface TocSidebarProps {
  items: TocItem[]
}

export default function TocSidebar({ items }: TocSidebarProps) {
  if (items.length === 0)
    return null

  return (
    <aside class="sticky top-8 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <nav class="space-y-2">
        <h2 class="text-xs font-semibold text-base-content/70 uppercase tracking-widest mb-4">
          On this page
        </h2>
        <ul class="space-y-2">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}>
              <a
                href={`#${item.id}`}
                class="link link-hover text-sm"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
