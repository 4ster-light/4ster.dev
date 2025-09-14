import { dev } from "$app/environment"

export const URL = dev ? "/" as const : "https://aster.deno.dev/" as const
export const POSTS_URL = dev ? "/posts/" as const : `${URL}posts/` as const
export const KOFI_URL = "https://ko-fi.com/4ster/" as const
export const GITHUB_URL = "https://github.com/4ster-light/" as const
export const X_URL = "https://x.com/4ster_light/" as const
export const UNI_URL = "https://esi.uclm.es/" as const
export const BANNER_URL = dev ? "/banner.png" as const : `${URL}banner.png` as const
export const PROJECTS_URL = dev ? "/projects" as const : `${URL}projects/` as const
