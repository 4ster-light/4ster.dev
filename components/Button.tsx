import type { ComponentChildren } from "preact"

interface Props {
  href: string
  target?: string
  rel?: string
  children: ComponentChildren
}

export default function Button({
  href,
  target = "_blank",
  rel = "noopener noreferrer",
  children
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      class="btn btn-secondary gap-2"
    >
      {children}
    </a>
  )
}
