import { fresh } from "@fresh/plugin-vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [fresh(), tailwindcss()],
  server: {
    allowedHosts: ["aster--local.4ster.deno.net"]
  }
})
