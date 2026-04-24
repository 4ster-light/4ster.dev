export interface TocItem {
  id: string
  level: number
  text: string
}

export function extractHeadings(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = []
  const headingRegex = /<(h[2-4])(.*?)>(.*?)<\/\1>/gi
  const modifiedHtml = html.replace(headingRegex, (match, tag, attrs, content) => {
    const level = parseInt(tag[1], 10)
    const text = content.replace(/<[^>]*>/g, "")
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    items.push({ id, level, text })

    const hasId = attrs.includes("id=")
    if (hasId) return match
    return `<${tag} id="${id}"${attrs}>${content}</${tag}>`
  })

  return { html: modifiedHtml, items }
}
