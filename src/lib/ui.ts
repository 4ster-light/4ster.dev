import type { Lang } from "./site.ts"

export interface UiStrings {
	blog: {
		eyebrow: string
		title: string
		description: string
		empty: string
		filterLabel: string
	}
	post: {
		morePosts: string
		older: string
		newer: string
		allPosts: string
		backToAllPosts: string
		sponsor: string
		switchTo: string
	}
}

export const UI: Record<Lang, UiStrings> = {
	en: {
		blog: {
			eyebrow: "Writing",
			title: "Notes on programming and computer science",
			description:
				"I write about the things I am learning and building: interpreters, procedural generation, tooling, and whatever else catches my attention.",
			empty: "No English posts yet.",
			filterLabel: "Browse posts by language"
		},
		post: {
			older: "← Older",
			morePosts: "More posts",
			newer: "Newer →",
			allPosts: "All posts",
			backToAllPosts: "Back to all posts",
			sponsor: "Sponsor",
			switchTo: "Leer en español 🇪🇸"
		}
	},
	es: {
		blog: {
			eyebrow: "Artículos",
			title: "Notas sobre programación y ciencias de la computación",
			description:
				"Escribo sobre lo que voy aprendiendo y construyendo: intérpretes, generación procedural, herramientas y cualquier otra cosa que me llame la atención.",
			empty: "Ningún artículo en español por ahora...",
			filterLabel: "Explorar artículos por idioma"
		},
		post: {
			older: "← Más antiguo",
			morePosts: "Más artículos",
			newer: "Más reciente →",
			allPosts: "Todos los artículos",
			backToAllPosts: "Volver a todos los artículos",
			sponsor: "Patrocinar",
			switchTo: "Read in English 🇬🇧"
		}
	}
}

export const ui = (lang: Lang): UiStrings => UI[lang]
