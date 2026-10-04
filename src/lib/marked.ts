import { Lexer, Marked, type Tokens } from "marked"
import { gfmHeadingId } from "marked-gfm-heading-id"
import {
  bundledLanguages,
  createHighlighter,
  createJavaScriptRegexEngine,
  type Highlighter
} from "shiki"

// Shiki highlighter singleton. Only `plaintext` is preloaded; every other
// language is lazy-loaded on demand from shiki's bundled grammars, so any
// non-esoteric fenced language works without maintaining a fixed list.
// The JavaScript regex engine is used because the Oniguruma WASM engine
// cannot instantiate inside Cloudflare Workers (WASM codegen disallowed).
const shiki = await createHighlighter({
  themes: ["vitesse-dark"],
  langs: ["plaintext"],
  engine: createJavaScriptRegexEngine({ forgiving: true })
})

// Marked does not await async renderers, so languages must be loaded before
// parsing. Call `preloadHighlightLanguages` before `marked.parse` (both are
// cheap when there is nothing new to load).
export async function preloadHighlightLanguages(markdown: string): Promise<void> {
  const langs = new Set<string>()
  const walk = (tokens: Tokens.Generic[]) => {
    for (const token of tokens) {
      if (token.type === "code") {
        const id = langId(token.lang)
        if (id) langs.add(id)
      }
      for (const key of ["tokens", "items"] as const) {
        const nested = (token as Record<string, unknown>)[key]
        if (Array.isArray(nested)) walk(nested as Tokens.Generic[])
      }
    }
  }
  walk(Lexer.lex(markdown))
  await Promise.all(
    [...langs].map((lang) =>
      shiki.getLoadedLanguages().includes(lang) ? Promise.resolve() : shiki.loadLanguage(lang)
    )
  )
}

function langId(lang?: string): string | undefined {
  // `token.lang` is the full info string (e.g. `toml title="x"`); shiki only
  // accepts the first word, and unknown languages must fall back to plaintext.
  const id = (lang ?? "").trim().split(/\s+/)[0]?.toLowerCase()
  return id && id in bundledLanguages ? id : undefined
}

function highlight(highlighter: Highlighter, code: string, lang?: string): string {
  return highlighter.codeToHtml(code, {
    lang: langId(lang) ?? "plaintext",
    theme: "vitesse-dark"
  })
}

export default new Marked(gfmHeadingId(), {
  renderer: {
    codespan(token) {
      return `<code class="shiki-inline">${token.text}</code>`
    },
    code(token) {
      const code = token.text.replace(/^\n+|\n+$/g, "")
      let html: string
      try {
        html = highlight(shiki, code, token.lang)
      } catch (_error) {
        // Unknown language or highlighter failure: fall back to plaintext so
        // the block keeps its styling instead of degrading to a bare <pre>.
        html = highlight(shiki, code)
      }

      // Shiki closes each line's span with a newline separator; strip the
      // newlines and inject line numbers as inline spans.
      const normalized = html.replace(/<\/span>\s*(?=<span class="line">)/g, "</span>")

      let lineNumber = 0
      const highlighted = normalized.replace(/<span class="line">/g, () => {
        lineNumber += 1
        return `<span class="line"><span class="line-number">${lineNumber}</span>`
      })

      return `<div class="shiki-wrapper">${highlighted}</div>\n`
    }
  }
})
