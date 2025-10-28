import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, type UserConfig } from "vite"

export default defineConfig({
  plugins: [sveltekit()]
}) satisfies UserConfig
