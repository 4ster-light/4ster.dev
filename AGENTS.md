# AGENTS.md

## Repo Shape

- Astro site, not Fresh.
- `src/pages/` holds routes, `src/layouts/` shared layouts, `src/components/` presentational pieces,
  and `src/lib/` shared helpers.
- Blog content lives in `src/content/posts/`; the collection schema is in `src/content.config.ts`.
- Static assets come from `static/` because `astro.config.mjs` sets `publicDir: "./static"`.

## Commands

- Use Deno tasks only.
- `deno task dev` starts the dev server.
- `deno task build` builds the site.
- `deno task start` previews the build.
- `deno task check` is the pre-commit gate; it runs `build`, then `fmt`, then `lint --fix`, then
  `deno check`, and it can modify files.

## Workflow

- Run `deno task check` before committing.
- Keep the existing import alias style (`@/` for local imports).
- Do not use `public/`; use `static/` for files that should be served directly.
- Markdown/content changes must satisfy `src/content.config.ts` fields: `title`, `description`,
  `date`, optional `tags`, `is-preview`, and `header-image`.

## Runtime Notes

- `src/lib/cache.ts` uses Deno KV when available and falls back cleanly when it is not, so cache
  code should keep that behavior.
- Dev server host access is already configured for `aster--local.4ster.deno.net` in
  `astro.config.mjs`.
