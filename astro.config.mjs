import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import react from "@astrojs/react"
import markdoc from "@astrojs/markdoc"
import keystatic from "@keystatic/astro"
import cloudflare from "@astrojs/cloudflare"

export default defineConfig({
  site: "https://4ster.dev",
  integrations: [react(), markdoc(), keystatic()],
  adapter: cloudflare({ imageService: { build: "compile", runtime: "cloudflare-binding" } }),
  vite: { plugins: [tailwindcss()] }
})
