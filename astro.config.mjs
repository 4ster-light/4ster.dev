import cloudflare from "@astrojs/cloudflare"
import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import keystatic from "@keystatic/astro"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

export default defineConfig({
	site: "https://4ster.dev",
	integrations: [react(), markdoc(), keystatic()],
	adapter: cloudflare({ imageService: "passthrough" }),
	vite: {
		plugins: [tailwindcss()],
		build: { chunkSizeWarningLimit: 3000 } // Silence Keystatic bundle size warning
	}
})
