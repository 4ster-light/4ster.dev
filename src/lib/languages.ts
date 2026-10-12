// A subset of GitHub's language colours (github-linguist) used for the small
// coloured dot on project cards. Unknown languages fall back to a neutral gray.
const LANGUAGE_COLORS: Record<string, string> = {
	Astro: "#ff5a03",
	C: "#555555",
	"C#": "#178600",
	"C++": "#f34b7d",
	"Common Lisp": "#3fb68b",
	CSS: "#563d7c",
	Dart: "#00B4AB",
	Dockerfile: "#384d54",
	Elixir: "#6e4a7e",
	Go: "#00ADD8",
	Haskell: "#5e5086",
	HTML: "#e34c26",
	Java: "#b07219",
	JavaScript: "#f1e05a",
	Julia: "#a270ba",
	Kotlin: "#A97BFF",
	Lua: "#000080",
	Nix: "#7e7eff",
	"Objective-C": "#438eff",
	Odin: "#60AFFE",
	PHP: "#4F5D95",
	Python: "#3572A5",
	Ruby: "#701516",
	Rust: "#dea584",
	Scala: "#c22d40",
	Shell: "#89e051",
	SQL: "#e38c00",
	Svelte: "#ff3e00",
	Swift: "#F05138",
	TypeScript: "#3178c6",
	Vue: "#41b883",
	Zig: "#ec915c"
}

const FALLBACK_COLOR = "#8b949e"

export function languageColor(language?: string): string {
	if (!language) return FALLBACK_COLOR
	return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR
}
