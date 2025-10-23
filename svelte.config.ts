import adapter from "@deno/svelte-adapter"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import type { Config } from "@sveltejs/kit"

const config: Config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
}

export default config
