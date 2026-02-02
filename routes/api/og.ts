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

    // Truncate title if too long
    const maxTitleLength = 50
    const displayTitle = title.length > maxTitleLength
      ? title.substring(0, maxTitleLength) + "..."
      : title

    // Truncate subtitle if too long
    const maxSubtitleLength = 100
    const displaySubtitle = subtitle.length > maxSubtitleLength
      ? subtitle.substring(0, maxSubtitleLength) + "..."
      : subtitle

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
  <rect x="0" y="0" width="8" height="600" fill="url(#accent)" />
  
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
  <g transform="translate(360, 0)">
    <!-- Type badge -->
    ${
      typeLabel
        ? `
    <rect x="0" y="180" width="${
          typeLabel.length * 12 + 32
        }" height="36" rx="18" fill="${COLORS.primary}" opacity="0.2" />
    <text x="16" y="205" font-family="Inter" font-size="18" font-weight="500" fill="${COLORS.primary}">${typeLabel}</text>
    `
        : ""
    }
    
    <!-- Title -->
    <text x="0" y="${
      typeLabel ? 280 : 260
    }" font-family="Inter" font-size="56" font-weight="700" fill="${COLORS.baseContent}">
      ${escapeXml(displayTitle)}
    </text>
    
    <!-- Subtitle -->
    ${
      displaySubtitle
        ? `
    <text x="0" y="${
          typeLabel ? 340 : 320
        }" font-family="Inter" font-size="28" font-weight="400" fill="${COLORS.baseContent}" opacity="0.7">
      ${escapeXml(displaySubtitle)}
    </text>
    `
        : ""
    }
    
    <!-- Site name -->
    <text x="0" y="520" font-family="Inter" font-size="24" font-weight="400" fill="${COLORS.secondary}">4ster.dev</text>
  </g>
  
  <!-- Bottom accent line -->
  <rect x="360" y="560" width="200" height="4" rx="2" fill="url(#accent)" />
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
