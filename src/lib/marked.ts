import { Marked } from "marked"
import { gfmHeadingId } from "marked-gfm-heading-id"
import { type BundledLanguage, createHighlighter } from "shiki"

const flourite = (await import("flourite")).default as unknown as (
  snippet: string,
  options?: { shiki?: boolean }
) => { statistics?: Record<string, number> }

const shiki = await createHighlighter({
  themes: ["vitesse-dark"],
  langs: Object.keys(flourite("", { shiki: true }).statistics || {})
    .filter((lang) => lang !== "Unknown")
    .map((lang) => lang.toLowerCase().replace(/\s+/g, "-")) as BundledLanguage[]
})

export default new Marked(gfmHeadingId(), {
  renderer: {
    codespan(token) {
      return `<code class="shiki-inline">${token.text}</code>`
    },
    code(token) {
      try {
        const code = token.text.replace(/^\n+|\n+$/g, "")
        const html = shiki
          .codeToHtml(code, {
            lang: token.lang ?? "plaintext",
            theme: "vitesse-dark"
          })
          .replace(/<\/span>\s*(?=<span class="line">)/g, "</span>")

        let lineNumber = 0
        const highlighted = html.replace(/<span class="line">/g, () => {
          lineNumber += 1
          return `<span class="line"><span class="line-number">${lineNumber}</span>`
        })

        return `<div class="shiki-wrapper">${highlighted}</div>\n`
      } catch (_error) {
        return `<pre><code class="shiki-error">${token.text}</code></pre>`
      }
    }
  }
})
