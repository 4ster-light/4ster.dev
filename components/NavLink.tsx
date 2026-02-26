interface Props {
  href: string
  target?: string
  rel?: string
  icon: string
  label: string
}

export default function NavLink({
  href,
  target = "_blank",
  rel = "noopener noreferrer",
  icon,
  label
}: Props) {
  return (
    <a href={href} target={target} rel={rel} class="btn gap-2">
      <img src={icon} alt={label} class="size-6 brightness-200" />
      <span class="hidden sm:inline">{label}</span>
    </a>
  )
}
