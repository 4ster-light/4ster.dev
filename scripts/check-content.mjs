// Guards the bilingual content rules that the type system cannot: both halves
// of a translation pair must share one `translationKey`, and no key may repeat
// within a language.
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"

const directory = path.join(
	import.meta.dirname,
	"..",
	"src",
	"content",
	"posts"
)
const files = (await readdir(directory)).filter((name) =>
	name.endsWith(".mdoc")
)
const errors = []
const seen = new Map()

const scalar = (frontmatter, key) => {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))
	if (!match) return undefined
	return match[1].trim().replace(/^["']|["']$/g, "")
}

for (const file of files) {
	const raw = await readFile(path.join(directory, file), "utf8")
	const slug = file.replace(/\.mdoc$/, "")
	const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ""

	if (!frontmatter) {
		errors.push(`${slug}: missing frontmatter`)
		continue
	}

	const lang = scalar(frontmatter, "lang") ?? "en"
	const translationKey = scalar(frontmatter, "translationKey")
	const date = scalar(frontmatter, "date")

	if (lang !== "en" && lang !== "es") {
		errors.push(`${slug}: lang must be "en" or "es", found "${lang}"`)
	}
	if (!date || Number.isNaN(new Date(date).valueOf())) {
		errors.push(`${slug}: date is missing or unparsable`)
	}
	if (!translationKey) continue

	if (!/^[a-z0-9][a-z0-9-]*$/.test(translationKey)) {
		errors.push(
			`${slug}: translationKey "${translationKey}" must be a lowercase slug`
		)
	}

	const identity = `${translationKey}:${lang}`
	const duplicate = seen.get(identity)
	if (duplicate) {
		errors.push(
			`${slug}: translationKey "${translationKey}" is already used by ${duplicate} in ${lang}`
		)
	}
	seen.set(identity, slug)
}

if (errors.length > 0) {
	console.error(
		`Content check failed:\n${errors.map((error) => `  - ${error}`).join("\n")}`
	)
	process.exit(1)
}

console.log(`Content check passed (${files.length} posts).`)
