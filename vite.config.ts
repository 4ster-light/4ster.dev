import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, type UserConfig } from "vite"

const config: UserConfig = defineConfig({
  plugins: [sveltekit()],
})

export default config
