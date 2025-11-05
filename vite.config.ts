import { sveltekit } from "@sveltejs/kit/vite"
import deno from "@deno/vite-plugin"
import { defineConfig, type UserConfig } from "vite"

export default defineConfig({
  plugins: [
    sveltekit(),
    deno()
  ]
}) satisfies UserConfig
