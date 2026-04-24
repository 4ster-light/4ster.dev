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
          .replace(/>\s+</g, "><")

        return `<div class="shiki-wrapper">${html}</div>\n`
      } catch (_error) {
        return `<pre><code class="shiki-error">${token.text}</code></pre>`
      }
    }
  }
})
