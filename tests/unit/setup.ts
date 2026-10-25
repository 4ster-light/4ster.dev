import { applyD1Migrations } from "cloudflare:test"
import { env } from "cloudflare:workers"
import type { D1Migration } from "@cloudflare/vitest-plugin"
import { beforeAll } from "vitest"

beforeAll(async () => {
	const testEnv = env as Env & { TEST_MIGRATIONS: D1Migration[] }
	await applyD1Migrations(testEnv.DB, testEnv.TEST_MIGRATIONS)
})
