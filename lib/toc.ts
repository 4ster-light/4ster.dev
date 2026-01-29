export interface TocItem {
  id: string
  level: number
  text: string
}

export function extractHeadings(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = []
  let modifiedHtml = html

  // Match h2, h3, h4 headings (skip h1 as it's usually the title)
  const headingRegex = /<(h[2-4])(.*?)>(.*?)<\/\1>/gi

  modifiedHtml = modifiedHtml.replace(headingRegex, (match, tag, attrs, content) => {
    const level = parseInt(tag[1])
    const text = content.replace(/<[^>]*>/g, "") // Remove any nested HTML tags
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim()

    items.push({ id, level, text })

    // Add ID to the heading if it doesn't already have one
    const hasId = attrs.includes("id=")
    if (hasId)
      return match
    return `<${tag} id="${id}"${attrs}>${content}</${tag}>`
  })

  return { html: modifiedHtml, items }
}
