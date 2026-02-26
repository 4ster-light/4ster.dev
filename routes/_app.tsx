import type { ComponentChildren } from "preact"
import NavLink from "@/components/NavLink.tsx"
import urls from "@/lib/urls.ts"
import { define } from "@/utils.ts"

function Html({ children }: { children: ComponentChildren }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/pfp.jpg" />
      </head>
      {children}
    </html>
  )
}

export default define.page(async function App({ Component }) {
  const navLinks = [
    {
      href: urls.bio,
      label: "Link Tree",
      icon: (await import("@/assets/icons/Link.svg")).default
    },
    {
      href: urls.projects,
      label: "Projects",
      icon: (await import("@/assets/icons/Code.svg")).default,
      target: ""
    },
    {
      href: urls.donate,
      label: "Support Me",
      icon: (await import("@/assets/icons/Love.svg")).default,
      target: ""
    }
  ]

  return (
    <Html>
      <body class="min-h-screen flex flex-col bg-base-100 text-base-content">
        <header class="border-b border-base-300 bg-base-200/30">
          <nav class="max-w-4xl mx-auto p-4 lg:px-0 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
            <a href={urls.url} class="text-3xl link-hover font-bold text-secondary">
              ✰λster✰
            </a>

            <div class="flex flex-wrap items-center justify-center md:justify-end gap-2">
              {navLinks.map(({ href, label, icon, target }) => (
                <NavLink href={href} label={label} icon={icon} target={target} key={href} />
              ))}
            </div>
          </nav>
        </header>

        <main class="max-w-4xl mx-auto p-4 sm:p-8 lg:px-0 flex-1 w-full">
          <Component />
        </main>

        <footer class="border-t border-base-300 bg-base-200/40">
          <div class="max-w-4xl mx-auto py-4 text-center text-base-content/70">
            <p>© {new Date().getFullYear()} ✰λster✰</p>
          </div>
        </footer>
      </body>
    </Html>
  )
})
