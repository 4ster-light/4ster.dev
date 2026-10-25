import path from "node:path"
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin"
import { defineConfig } from "vitest/config"

const migrations = await readD1Migrations(
	path.join(import.meta.dirname, "migrations")
)

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: "./wrangler.jsonc" },
			miniflare: {
				bindings: { TEST_MIGRATIONS: migrations }
			}
		})
	],
	test: {
		include: ["tests/unit/**/*.test.ts"],
		setupFiles: ["./tests/unit/setup.ts"]
	}
})
