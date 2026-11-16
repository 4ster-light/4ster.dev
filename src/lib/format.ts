import { BCP47, type Lang } from "./site.ts"

type DateKind = "long" | "short" | "monthYear"

const DATE_OPTIONS: Record<DateKind, Intl.DateTimeFormatOptions> = {
	long: { year: "numeric", month: "long", day: "numeric" },
	short: { year: "numeric", month: "short", day: "numeric" },
	monthYear: { year: "numeric", month: "short" }
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function formatterFor(kind: DateKind, lang: Lang): Intl.DateTimeFormat {
	const key = `${kind}:${lang}`
	const cached = formatters.get(key)
	if (cached) return cached

	const created = new Intl.DateTimeFormat(BCP47[lang], DATE_OPTIONS[kind])
	formatters.set(key, created)
	return created
}

export function formatDate(date: Date | string, lang: Lang = "en"): string {
	return formatterFor("long", lang).format(new Date(date))
}

export function formatShortDate(
	date: Date | string,
	lang: Lang = "en"
): string {
	return formatterFor("short", lang).format(new Date(date))
}

/**
 * Human-friendly "last updated" label. Accepts an ISO string (GitHub API) or a
 * pre-formatted date and degrades gracefully when the value cannot be parsed.
 */
export function formatUpdated(date: Date | string, lang: Lang = "en"): string {
	const parsed = new Date(date)
	if (Number.isNaN(parsed.valueOf())) return String(date)

	const prefix = lang === "es" ? "Actualizado" : "Updated"
	const now = new Date()

	if (parsed.getFullYear() === now.getFullYear()) {
		const month = new Intl.DateTimeFormat(BCP47[lang], {
			month: "short"
		}).format(parsed)
		return `${prefix} ${month} ${parsed.getFullYear()}`
	}

	return `${prefix} ${formatterFor("monthYear", lang).format(parsed)}`
}

export function readingTime(
	text: string | undefined,
	lang: Lang = "en"
): string {
	const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length
	const minutes = Math.max(1, Math.round(words / 200))
	return lang === "es" ? `${minutes} min de lectura` : `${minutes} min read`
}
