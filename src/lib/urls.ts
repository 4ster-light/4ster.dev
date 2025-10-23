import { dev } from "$app/environment"

// Base
export const URL = dev ? ("/" as const) : ("https://4ster.dev" as const)

// Routes
export const POSTS_URL = dev ? ("/posts" as const) : (`${URL}posts/` as const)
export const PROJECTS_URL = dev ? ("/projects" as const) : (`${URL}projects/` as const)
export const DONATE_URL = dev ? ("/donate" as const) : (`${URL}donate/` as const)

// External
export const KOFI_URL = "https://ko-fi.com/4ster" as const
export const GITHUB_URL = "https://github.com/4ster-light" as const
export const X_URL = "https://x.com/4ster_light" as const
export const UNI_URL = "https://esi.uclm.es" as const

// Static Assets
export const BANNER_URL = dev ? ("/banner.png" as const) : (`${URL}banner.png` as const)
