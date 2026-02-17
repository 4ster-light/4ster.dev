import { define } from "@/utils.ts"
import { initWasm, Resvg } from "@resvg/resvg-wasm"

// Colors from the teal_dark theme
const COLORS = {
  base100: "#0f1419",
  base200: "#1a2028",
  base300: "#252d38",
  baseContent: "#dce8ea",
  primary: "#45a293",
  secondary: "#3d8c7e"
}

export type OGType = "post" | "project" | "default"

// Cache for WASM, fonts, and pfp
let initialized = false
let fontBuffers: Uint8Array[] = []
let pfpBase64 = ""

async function ensureInitialized(baseUrl: string) {
  if (!initialized) {
    // Load the WASM module from CDN
    const wasmUrl = "https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm"
    const wasmResponse = await fetch(wasmUrl)
    if (!wasmResponse.ok)
      throw new Error(`Failed to fetch WASM: ${wasmResponse.statusText}`)
    const wasmBuffer = await wasmResponse.arrayBuffer()
    await initWasm(wasmBuffer)

    // Load fonts and pfp via HTTP
    const [regularFontRes, boldFontRes, pfpRes] = await Promise.all([
      fetch(`${baseUrl}/fonts/Inter-Regular.ttf`),
      fetch(`${baseUrl}/fonts/Inter-Bold.ttf`),
      fetch(`${baseUrl}/pfp.jpg`)
    ])

    const [regularFont, boldFont, pfpData] = await Promise.all([
      regularFontRes.arrayBuffer(),
      boldFontRes.arrayBuffer(),
      pfpRes.arrayBuffer()
    ])

    fontBuffers = [new Uint8Array(regularFont), new Uint8Array(boldFont)]
    pfpBase64 = btoa(String.fromCharCode(...new Uint8Array(pfpData)))

    initialized = true
  }
}

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const title = url.searchParams.get("title") || "4ster.dev"
    const subtitle = url.searchParams.get("subtitle") || ""
    const type: OGType = (url.searchParams.get("type") as OGType) || "default"

    // Initialize WASM, fonts, and pfp
    await ensureInitialized(baseUrl)

    const pfpDataUri = `data:image/jpeg;base64,${pfpBase64}`

    // Wrap text for multiline display
    const titleLines = wrapText(title, 28, 2) // Max 28 chars per line, max 2 lines
    const subtitleLines = subtitle ? wrapText(subtitle, 45, 3) : [] // Max 45 chars per line, max 3 lines

    // Type badge text
    const typeLabel = type === "post" ? "Blog Post" : type === "project" ? "Project" : ""

    const svg = `
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.base100};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.base200};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.secondary};stop-opacity:1" />
    </linearGradient>
    <clipPath id="pfpClip">
      <circle cx="180" cy="300" r="120" />
    </clipPath>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="600" fill="url(#bg)" />
  
  <!-- Left accent bar -->
  <rect x="0" y="0" width="20" height="600" fill="url(#accent)" />
  
  <!-- Profile picture with border -->
  <circle cx="180" cy="300" r="125" fill="${COLORS.primary}" opacity="0.3" />
  <circle cx="180" cy="300" r="122" fill="${COLORS.base300}" />
  <image 
    href="${pfpDataUri}" 
    x="60" 
    y="180" 
    width="240" 
    height="240" 
    clip-path="url(#pfpClip)"
    preserveAspectRatio="xMidYMid slice"
  />
  
  <!-- Content area -->
  <g transform="translate(380, 0)">
    <!-- Type badge -->
    ${
      typeLabel
        ? `
    <rect x="0" y="160" width="${
          typeLabel.length * 12 + 32
        }" height="36" rx="18" fill="${COLORS.primary}" opacity="0.2" />
    <text x="16" y="185" font-family="Inter" font-size="18" font-weight="500" fill="${COLORS.primary}">${typeLabel}</text>
    `
        : ""
    }
    
    <!-- Title -->
    <text x="0" y="${
      typeLabel ? 260 : 220
    }" font-family="Inter" font-size="52" font-weight="700" fill="${COLORS.baseContent}">
      ${renderMultilineText(titleLines, 0, typeLabel ? 260 : 220, 64)}
    </text>
    
    <!-- Subtitle -->
    ${
      subtitleLines.length > 0
        ? `
    <text x="0" y="${
          typeLabel ? 260 + titleLines.length * 64 + 24 : 220 + titleLines.length * 64 + 24
        }" font-family="Inter" font-size="26" font-weight="400" fill="${COLORS.baseContent}" opacity="0.7">
      ${
          renderMultilineText(
            subtitleLines,
            0,
            typeLabel ? 260 + titleLines.length * 64 + 24 : 220 + titleLines.length * 64 + 24,
            36
          )
        }
    </text>
    `
        : ""
    }
    
    <!-- Site name -->
    <text x="0" y="540" font-family="Inter" font-size="24" font-weight="400" fill="${COLORS.secondary}">4ster.dev</text>
  </g>
  
  <!-- Bottom accent line -->
  <rect x="380" y="560" width="200" height="4" rx="2" fill="url(#accent)" />
</svg>
    `.trim()

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: "width",
        value: 1200
      },
      font: {
        fontBuffers,
        defaultFontFamily: "Inter"
      }
    })
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    return new Response(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400"
      }
    })
  }
})

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  if (text.length <= maxChars) return [text]

  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxChars) {
      if (currentLine) {
        lines.push(currentLine.trim())
        currentLine = word
      } else {
        lines.push(word.substring(0, maxChars))
      }
    } else {
      currentLine = (currentLine + " " + word).trim()
    }

    if (lines.length >= maxLines) break
  }

  if (lines.length < maxLines && currentLine)
    lines.push(currentLine.trim())

  // Truncate last line if needed
  if (lines.length === maxLines && text.length > lines.join(" ").length) {
    const lastLine = lines[maxLines - 1]
    if (lastLine.length > maxChars - 3)
      lines[maxLines - 1] = lastLine.substring(0, maxChars - 3) + "..."
    else
      lines[maxLines - 1] = lastLine + "..."
  }

  return lines
}

function renderMultilineText(
  lines: string[],
  startX: number,
  _startY: number,
  lineHeight: number
): string {
  return lines.map((line, index) =>
    `<tspan x="${startX}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`
  ).join("")
}
