import { Marked } from "marked"
import { gfmHeadingId } from "marked-gfm-heading-id"
import flourite from "flourite"
import { type BundledLanguage, createHighlighter } from "shiki"

const shiki = await createHighlighter({
  themes: ["vitesse-dark"],
  langs: Object.keys(flourite("", { shiki: true }).statistics || {})
    .filter((lang) => lang !== "Unknown")
    .map((lang) => lang.toLowerCase().replace(/\s+/g, "-")) as BundledLanguage[]
})

export default new Marked(
  gfmHeadingId(),
  {
    renderer: {
      codespan(token) {
        return `<code class="shiki-inline">${token.text}</code>`
      },
      code(token) {
        try {
          const html = shiki.codeToHtml(token.text, {
            lang: token.lang ?? "plaintext",
            theme: "vitesse-dark"
          })

          const lineNumbers = token.text.split("\n")
            .map((_, i) => `<span class="line-number">${i + 1}</span>`)
            .join("\n")

          const highlighted = html.replace(
            /<code[^>]*>/,
            `<code class="flex"><span class="line-numbers">${lineNumbers}</span><span style="flex: 1;">`
          ).replace("</code>", "</span></code>")

          return `<div class="shiki-wrapper">${highlighted}</div>\n`
        } catch (_error) {
          return `<pre><code class="shiki-error">${token.text}</code></pre>`
        }
      }
    }
  }
)
