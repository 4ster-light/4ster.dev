# AGENTS.md

## Source Of Truth

- Prefer `package.json`, `biome.json`, `wrangler.jsonc`, `migrations/*.sql`, and
  `src/content.config.ts` over prose when they differ.

## Commands

- Use `pnpm run dev` for local Astro dev.
- Use `pnpm run build` before deployment or when you need the Cloudflare bundle to be regenerated.
- Use `pnpm run preview` to test the production build locally with `astro preview` (the
  Cloudflare adapter's Vite preview server).
- Use `pnpm run lint` for formatting, linting, and import organization with Biome, but expect it to
  modify files because it runs `biome check --fix`.
- Use `pnpm run fmt` when you only want Biome formatting.
- Use `pnpm run check` to sync content and run `astro check` for type errors.
- Use `pnpm run sync` to regenerate Astro content types before build/preview.
- Use `pnpm run types` to regenerate `worker-configuration.d.ts` with `wrangler types`; run it after
  a build so the build output exists.
- Apply pending D1 migrations locally before testing interactions:
  `pnpm exec wrangler d1 migrations apply DB --local`.
- Apply migrations to production only with `pnpm exec wrangler d1 migrations apply DB --remote`.
  Always pass `--local` or `--remote` explicitly so the target database is unambiguous.

## Repo Shape

- `src/pages/` is the app surface: home, projects, article routes, and the JSON API live here.
- `src/content/posts/` holds blog posts.
- `src/lib/projects.ts` fetches featured GitHub repos and README content for the projects pages/API.
- `migrations/` contains the tracked D1 schema migrations for post interactions.
- `src/lib/engagement.ts` handles visitor cookies, consent checks, slug validation, and JSON/error
  responses.
- `src/pages/api/posts/[slug]/like.ts` and `comments.ts` implement likes/comments;
  `src/pages/api/engagement/consent.ts` clears the visitor cookie when consent is denied.
- `src/components/PostInteractions.astro` renders the discussion UI and
  `src/components/EngagementConsent.astro` renders the cookie prompt.
- `keystatic.config.ts` is the content editor config; post content is stored in
  `src/content/posts/*`.

## Content Rules

- Blog posts use frontmatter with `title`, `description`, `date`, `lang`, optional `translationKey`,
  optional `tags`, and optional `is-preview`.
- `lang` is only `en` or `es`.
- All blog post text and content (`src/content/posts/*`) is licensed under CC BY-NC-SA 4.0; do not
  introduce content under a different license.
- If a post exists in both languages, both files must share the same `translationKey`.
- Legacy `/posts/[slug]` URLs redirect to `/{lang}/posts/[slug]`.

## Workflow Notes

- `pnpm run build` runs `astro sync`, `astro build`, then `wrangler types`. `@astrojs/cloudflare` v14
  emits `dist/client/` and `dist/server/` (worker entry `dist/server/entry.mjs`) plus its own
  generated `dist/server/wrangler.json`. The source `wrangler.jsonc` only carries bindings and
  observability settings; do not add `main` or `assets` to it, since the adapter/vite plugin supply
  those. Generating worker types after the build keeps `worker-configuration.d.ts` reproducible on a
  clean checkout (it includes `Cloudflare.GlobalProps`).
- The site targets Cloudflare Workers; `wrangler.jsonc` disables `workers_dev` and `preview_urls`.
  Deploy with the generated config (`wrangler deploy --config dist/server/wrangler.json`).
- Post interactions use the D1 binding `DB` (`aster-interactions` in production). Local D1 state is
  stored under `.wrangler/state/`, which is git-ignored; never commit, export, or import local test
  likes/comments into production. The production database must be created fresh and receive only
  the tracked migrations. The README documents initial setup and the full local/production
  migration workflow.
- Likes and comment submission require explicit cookie consent. The browser sends
  `X-Engagement-Consent: accepted`; the APIs reject likes and comment POSTs without it and only
  then create the HTTP-only `aster_visitor` cookie. Comment reads are public and cookie-free.
  Denying consent expires the cookie. Likes are unique per `(post_slug, visitor_hash)`; the visitor
  is anonymous and identified only by a hash of the cookie value.
- Add new D1 schema changes as new files in `migrations/`; do not edit a migration already applied
  to production. Apply migrations before deploying code that depends on them.
- The projects pages are prerendered. They read `GH_API` at build time through `import.meta.env`
  (Astro inlines it into the server bundle), while the runtime `/api/projects.json` route reads it
  from `process.env`. Cloudflare configures build and runtime secrets separately, so if the build
  cannot reach GitHub the prerender falls back to the deployed `/api/projects.json` for the project
  list and to `raw.githubusercontent.com` for READMEs.
- Formatting and linting are handled by Biome via `biome.json`: tab indentation, double quotes,
  semicolons as needed, and automatic import organization.
- `worker-configuration.d.ts` is generated by `wrangler types` and is excluded from Biome.
- `noUnusedVariables` and `noUnusedImports` are disabled for `.astro` files to avoid false positives
  in Astro templates.
- CI (`.github/workflows/ci.yml`) runs `pnpm exec biome ci .` and `pnpm run check` on pushes to
  `main` and pull requests. It does not build, migrate D1, or deploy; run those steps explicitly.
