# AGENTS.md

## Source Of Truth
- Prefer `package.json`, `deno.json`, `wrangler.jsonc`, and `src/content.config.ts` over prose when they differ.

## Commands
- Use `pnpm run dev` for local Astro dev.
- Use `pnpm run build` before deployment or when you need the Cloudflare bundle to be regenerated.
- Use `pnpm run preview` to test the production build locally with `wrangler dev --local`.
- Use `pnpm run lint` for formatting, linting, and type checking, but expect it to modify files because it runs `deno lint --fix`.
- `pnpm run sync` regenerates worker types before build/preview.

## Repo Shape
- `src/pages/` is the app surface: home, projects, article routes, and the JSON API live here.
- `src/content/posts/` holds blog posts.
- `src/lib/projects.ts` fetches featured GitHub repos and README content for the projects pages/API.
- `keystatic.config.ts` is the content editor config; post content is stored in `src/content/posts/*`.

## Content Rules
- Blog posts use frontmatter with `title`, `description`, `date`, `lang`, optional `translationKey`, optional `tags`, and optional `is-preview`.
- `lang` is only `en` or `es`.
- If a post exists in both languages, both files must share the same `translationKey`.
- Legacy `/posts/[slug]` URLs redirect to `/{lang}/posts/[slug]`.

## Workflow Notes
- Build and preview both depend on `wrangler types && astro sync`; do not skip `sync` when worker types are stale.
- The site targets Cloudflare Pages/Workers; `wrangler.jsonc` points production at `dist/_worker.js/index.js` and disables `workers_dev` and `preview_urls`.
- Deno formatting is configured for 2-space indent, no semicolons, double quotes, and `lineWidth: 100`.
- `deno lint` has repo-specific rule settings in `deno.json`; keep new code compatible with those rules.
