import cloudflare from "@astrojs/cloudflare"
import markdoc from "@astrojs/markdoc"
import react from "@astrojs/react"
import keystatic from "@keystatic/astro"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"

// `astro sync`/`check`/`build` run a content type-generation pass that
// rewrites `node_modules/.vite/deps_ssr`, which corrupts a running dev server's
// dependency cache on Cloudflare. Keep non-dev commands on their own cache
// until the upstream fix ships. See withastro/astro#18464.
const isolateNonDevCache = {
	name: "isolate-non-dev-cache",
	hooks: {
		"astro:config:setup": ({ command, updateConfig }) => {
			if (command === "dev") return
			updateConfig({ vite: { cacheDir: `./node_modules/.vite-${command}` } })
		}
	}
}

export default defineConfig({
	site: "https://4ster.dev",
	integrations: [isolateNonDevCache, react(), markdoc(), keystatic()],
	adapter: cloudflare({ imageService: "passthrough" }),
	vite: {
		plugins: [tailwindcss()],
		// Keystatic's API entry is discovered after the worker's first dependency
		// optimization pass, which triggers a reload and leaves the running
		// workerd instance importing a deleted chunk. Pre-bundling it up front
		// avoids that cold-start crash. See withastro/astro#18464.
		optimizeDeps: {
			include: ["@keystatic/astro/internal/keystatic-api.js"]
		},
		build: { chunkSizeWarningLimit: 3000 } // Silence Keystatic bundle size warning
	}
})
