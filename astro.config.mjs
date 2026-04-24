import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  output: "static",
  integrations: [],
  publicDir: "./static",
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["aster--local.4ster.deno.net"]
    }
  }
})
