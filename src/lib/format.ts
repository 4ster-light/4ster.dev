const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric"
})

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short"
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "short",
	day: "numeric"
})

export function formatDate(date: Date | string): string {
	return DATE_FORMATTER.format(new Date(date))
}

export function formatShortDate(date: Date | string): string {
	return SHORT_DATE_FORMATTER.format(new Date(date))
}

/**
 * Human-friendly "last updated" label. Accepts an ISO string (GitHub API) or a
 * pre-formatted date and degrades gracefully when the value cannot be parsed.
 */
export function formatUpdated(date: Date | string): string {
	const parsed = new Date(date)
	if (Number.isNaN(parsed.valueOf())) return String(date)

	const now = new Date()
	const sameYear = parsed.getFullYear() === now.getFullYear()

	if (sameYear) {
		const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
			parsed
		)
		return `Updated ${month} ${parsed.getFullYear()}`
	}

	return `Updated ${MONTH_YEAR_FORMATTER.format(parsed)}`
}

export function readingTime(text: string | undefined): string {
	const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length
	const minutes = Math.max(1, Math.round(words / 200))
	return `${minutes} min read`
}
