const baseUrl = "https://4ster.dev"

export const LANGUAGES = ["en", "es"] as const
export type Lang = (typeof LANGUAGES)[number]

export const otherLanguage = (lang: Lang): Lang => (lang === "en" ? "es" : "en")

/** BCP 47 tags used for `Intl` formatting. */
export const BCP47: Record<Lang, string> = { en: "en-US", es: "es-ES" }

/** Open Graph locale codes. */
export const OG_LOCALE: Record<Lang, string> = { en: "en_US", es: "es_ES" }

export const blogPath = (lang: Lang): string => `/${lang}/blog`
export const feedPath = (lang: Lang): string => `/${lang}/rss.xml`
export const postPath = (lang: Lang, slug: string): string =>
	`/${lang}/posts/${slug}`

/** The aggregate feed keeps `/rss.xml` so existing subscribers never move. */
export const combinedFeedPath = "/rss.xml"

const site = {
	url: "/",
	baseUrl,
	ogImage: "/og.png",
	substack: "https://4sterlight.substack.com",
	bio: "https://bio.4ster.dev",
	linkedin: "https://www.linkedin.com/in/4ster",
	github: "https://github.com/4ster-light",
	githubSponsors: "https://github.com/sponsors/4ster-light",
	projects: "/projects",
	cv: {
		en: "/cv/David_Vivar_Bogonez_CV_EN.pdf",
		es: "/cv/David_Vivar_Bogonez_CV_ES.pdf"
	},
	donate: "/sponsor",
	uni: "https://esi.uclm.es"
}

export default site
