import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const postsCollection = defineCollection({
	// Markdoc registers `.mdoc` as a content entry type, and the glob loader
	// renders it through that entry type. IDs drop the extension so they stay
	// URL-friendly (`hello-world.mdoc` → `hello-world`).
	loader: glob({
		pattern: "**/*.mdoc",
		base: "./src/content/posts",
		generateId: ({ entry }) => entry.replace(/\.mdoc$/, "")
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		lang: z.enum(["en", "es"]).default("en"),
		translationKey: z.string().optional(),
		tags: z.array(z.string()).default([]),
		"is-preview": z.boolean().optional().default(false)
	})
})

export const collections = {
	posts: postsCollection
}
