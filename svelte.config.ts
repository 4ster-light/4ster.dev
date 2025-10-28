import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import type { Config } from "@sveltejs/kit"

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
} satisfies Config
