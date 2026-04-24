# Fresh to Astro Git-CMS Migration Plan

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Migrate the current Fresh/Deno app to a static Astro site deployed on Deno Deploy, move blog posts into this repo and manage them through a git-backed CMS, while keeping GitHub-fetched projects with a custom cache.

**Architecture:**
- Blog posts become local content in the same repository and are rendered as Astro content collections at build time.
- The site is deployed as a static Astro build to Deno Deploy.
- A git-backed CMS edits post markdown/frontmatter directly in this repo and commits changes through GitHub.
- Projects remain remote GitHub data, but are fetched through a dedicated cache layer so the site does not hit GitHub on every request.
- The migration should preserve SEO, post permalinks, and the existing visual structure as much as possible.

**Tech Stack:**
- Astro for the site framework
- Deno Deploy as hosting/runtime
- Deno KV or an equivalent Deno Deploy cache for fetched project data
- Git-backed CMS such as Decap CMS or a comparable static git CMS
- Existing markdown/rendering utilities only where they still fit the Astro architecture

---

## Current-State Summary

The existing app is a Fresh application with these relevant pieces:
- `routes/index.tsx` fetches posts and renders the home page
- `routes/posts/[slug].tsx` renders individual blog posts
- `routes/projects/[slug].tsx` renders project detail pages
- `lib/content/posts.ts` fetches blog posts from a separate GitHub repo
- `lib/content/repositories.ts` fetches project metadata and READMEs from GitHub
- `lib/cache.ts` stores cached arrays in Deno KV
- `routes/api/cache/clear.ts` provides manual cache invalidation

The new target state should remove the external blog-repo dependency and make posts live in this repo.

---

## Proposed End State

### Content model
- Blog posts live under `content/posts/` or `src/content/posts/` in this repo.
- Each post has frontmatter for title, description, date, tags, preview status, and optional header image flag.
- Astro generates the blog index and individual post pages statically.

### CMS model
- A git-backed CMS sits under `/admin` or an equivalent static admin path.
- The CMS writes to the same repo so posts are versioned with the site source.
- Draft/published behavior is handled through frontmatter and/or CMS workflow support.

### Projects model
- Projects are still fetched from GitHub.
- Fetching goes through a cached service layer and an API endpoint or server-side data source.
- The cache should remain separate from the post content pipeline because projects are still dynamic.

### Deployment model
- Astro builds static output for Deno Deploy.
- If runtime endpoints are still needed for projects/cache refresh, keep them minimal and isolated.
- Keep the deploy pipeline simple: git push → CMS commit or direct commit → Deno Deploy build.

---

## Migration Plan

### Task 1: Decide the Astro deployment shape before moving code

**Objective:** Lock the top-level site architecture so the implementation does not drift between fully static, partially SSR, and hybrid modes.

**Files:**
- Create: `.hermes/plans/astro-migration-decisions.md` if you want a separate decision note, otherwise keep decisions in this plan
- Likely modify later: `astro.config.mjs`, `deno.jsonc`, deployment config files

**Decisions to make:**
1. Use Astro in fully static mode for public pages.
2. Keep only a tiny runtime surface for project fetching/cache refresh if needed.
3. Use local markdown content for posts, not remote GitHub content.
4. Use a git-backed CMS that commits to the same repo.

**Verification:**
- The chosen mode should support Deno Deploy without requiring a separate Node hosting stack.
- Public blog routes should be prerenderable.

---

### Task 2: Create the Astro project skeleton alongside the current app

**Objective:** Introduce Astro files and structure without yet deleting the Fresh app, so the migration can be incremental and reversible.

**Files:**
- Create: `astro.config.mjs`
- Create: `src/pages/index.astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/*` for reusable UI pieces migrated from `components/`
- Modify: `deno.jsonc`
- Modify: deployment entry/config if needed

**Implementation notes:**
- Mirror the current route structure in Astro first.
- Keep the page titles, meta tags, and layout semantics aligned with the Fresh version.
- Reuse styling as much as possible, but migrate it into Astro-compatible file locations.

**Verification:**
- `deno task build` or Astro’s build command succeeds in a minimal page setup.
- Home page renders with the existing branding and layout.

---

### Task 3: Move blog posts into the repository as local content

**Objective:** Replace the remote GitHub blog repo with local markdown content in this repo.

**Files:**
- Create: `src/content/posts/*.md` or `content/posts/*.md`
- Create: content schema file such as `src/content/config.ts`
- Modify: any current post-fetching code that still assumes remote GitHub content

**Content format:**
Use frontmatter similar to the current schema:

```md
---
title: "Post Title"
description: "Short summary"
date: "2026-04-22"
tags: ["astro", "deno"]
is-preview: false
header-image: true
---

Post body here.
```

**Implementation notes:**
- Preserve existing slugs where possible to avoid breaking links.
- If some old slugs differ, add redirects or alias pages.
- Make post metadata source-of-truth the markdown frontmatter.

**Verification:**
- Build can enumerate all local posts.
- A sample post page renders from local content.
- Existing published post URLs still resolve.

---

### Task 4: Rebuild the blog index and post pages in Astro

**Objective:** Replace Fresh server-rendered post routes with static Astro pages driven by local content.

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/posts/[slug].astro`
- Create/modify: post meta component equivalents, TOC component equivalents, markdown rendering helpers if needed
- Remove later: `routes/index.tsx`, `routes/posts/[slug].tsx`, and related Fresh-only helpers after cutover

**Implementation notes:**
- Generate the blog index from the content collection.
- Generate individual post pages statically at build time.
- Keep the current post card styling, TOC, and recent-posts sidebar behavior.
- Use Astro’s markdown handling or a shared renderer for headings/TOC extraction.

**Verification:**
- Blog listing shows all posts in the correct order.
- Individual post pages include title, metadata, TOC, and rendered HTML.
- No runtime fetch to a separate blog repo remains.

---

### Task 5: Add a git-backed CMS for post editing in the same repo

**Objective:** Provide a content editing workflow that commits post changes into this repository.

**Files:**
- Create: `public/admin/config.yml` or the equivalent CMS config location
- Create: `src/pages/admin/index.astro` or a static admin shell if the CMS needs one
- Create: CMS preview components if required
- Modify: GitHub auth / repo settings as needed

**Implementation notes:**
- Prefer a CMS that supports static hosting and git commits directly to the repo.
- Configure it to edit `src/content/posts/*.md` (or the chosen content directory).
- Set collection schema fields to match the post frontmatter.
- Decide whether drafts are handled with a `draft`/`is-preview` flag or via separate draft workflow support.

**Verification:**
- The admin UI loads from the deployed site.
- Saving a post creates a commit in the same repo.
- New commits trigger the Deno Deploy build and publish updated content.

---

### Task 6: Keep projects remote but add a dedicated cache layer

**Objective:** Preserve GitHub-fetched projects while making them efficient and reliable in the Astro deployment.

**Files:**
- Create: `src/lib/projects.ts` or similar
- Create: `src/routes/api/projects.ts` if runtime JSON is needed
- Create/modify: cache helper code, likely `src/lib/cache.ts` or a new Deno-friendly cache module
- Modify: `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro`

**Implementation options:**
1. **Static page + runtime API:** render the project index shell statically and fetch cached JSON from an endpoint.
2. **Build-time fetch + cache refresh endpoint:** fetch projects during build, but keep a cache-backed refresh route for runtime updates.
3. **Hybrid prerender + client hydrate:** prerender the page with cached data and refresh client-side when newer cached data exists.

**Recommended direction:**
- Use a cache-backed project service with a JSON endpoint.
- Cache the GitHub API payload and repository READMEs.
- Keep the cache invalidation endpoint so projects can be refreshed without redeploying.

**Verification:**
- Project pages still show GitHub metadata and README content.
- Cache hits avoid repeated GitHub requests.
- A manual refresh invalidates the cache and repopulates it.

---

### Task 7: Remove Fresh-specific code after Astro pages are verified

**Objective:** Delete obsolete Fresh runtime files once the Astro replacement is fully working.

**Files likely to remove or replace:**
- `main.ts`
- `client.ts`
- `routes/_app.tsx`
- `routes/index.tsx`
- `routes/posts/[slug].tsx`
- `routes/projects/[slug].tsx`
- `routes/api/cache/clear.ts` if replaced by an Astro API route
- Any Fresh-specific utilities that are no longer referenced

**Implementation notes:**
- Do this only after route parity is confirmed.
- Keep shared utilities only if Astro still uses them.
- Update imports and alias paths to the Astro structure.

**Verification:**
- No dead Fresh code remains in the build graph.
- The site still builds and deploys successfully.
- All public routes continue to work.

---

### Task 8: Update deployment and preview workflow for Deno Deploy

**Objective:** Make the new Astro site the deploy target and ensure preview/deploy commands match the new architecture.

**Files:**
- Modify: `deno.jsonc`
- Modify: `.github/workflows/*` if deployment is handled there
- Modify: any deploy config specific to Deno Deploy

**Implementation notes:**
- Update scripts so local development uses Astro’s dev server.
- Update build scripts to produce the static output expected by Deno Deploy.
- Confirm the deployment workflow can handle CMS-driven commits automatically.

**Verification:**
- Local dev starts the Astro app.
- Production build succeeds.
- Deno Deploy receives the correct output directory and serves static pages correctly.

---

## Suggested File Map After Migration

### New structure
- `astro.config.mjs`
- `src/pages/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/projects/index.astro`
- `src/pages/projects/[slug].astro`
- `src/content/config.ts`
- `src/content/posts/*.md`
- `src/components/*`
- `src/layouts/BaseLayout.astro`
- `src/lib/projects.ts`
- `src/lib/cache.ts` or equivalent
- `public/admin/config.yml`

### Likely removed Fresh files
- `routes/**`
- `main.ts`
- `client.ts`
- Fresh-only route helpers once no longer referenced

---

## Risks and Tradeoffs

1. **CMS choice risk**
   - A git-backed CMS must work cleanly with Deno Deploy and the repo’s auth setup.
   - If one CMS becomes awkward, pick the simplest static one that supports GitHub commits.

2. **Static vs runtime tension for projects**
   - Posts fit static perfectly.
   - Projects are dynamic by nature, so they need either runtime JSON or build-time regeneration.
   - Keep this concern isolated so it does not leak into the blog pipeline.

3. **URL parity and SEO**
   - Breaking current post or project URLs would be painful.
   - Add redirects or preserve slugs from the start.

4. **Cache complexity**
   - The current cache code is tightly coupled to Fresh-era server handlers.
   - It may be cleaner to replace it with a smaller Astro-era cache module instead of porting everything verbatim.

5. **Content migration effort**
   - Moving posts into this repo may require a one-time import of all existing markdown files.
   - If some posts live elsewhere or have unpublished drafts, decide how to represent them before migration.

---

## Open Questions

1. Which git-backed CMS should be used: Decap CMS, TinaCMS, or something else?
2. Should project data be fetched at build time, at request time, or via a client-side refresh from a cached API?
3. Should drafts remain in the repo as unpublished frontmatter, or should the CMS have a separate draft workflow?
4. Should old post URLs be preserved exactly, or is a redirect layer acceptable?
5. Do you want the migration done in a single cutover PR or as an incremental dual-stack transition?

---

## Recommended Execution Order

1. Finalize architecture decisions.
2. Scaffold Astro in parallel with the current Fresh app.
3. Move posts into local repo content.
4. Rebuild blog pages and SEO in Astro.
5. Add the git-backed CMS.
6. Rework projects with a dedicated cache layer.
7. Remove Fresh-only code.
8. Update deployment and preview workflow.

---

## Validation Checklist

- [ ] Blog posts are stored in this repo
- [ ] Blog routes are statically generated by Astro
- [ ] CMS edits create commits in the same repo
- [ ] Projects still come from GitHub
- [ ] Projects are cached
- [ ] Deno Deploy publishes the Astro build successfully
- [ ] Existing important URLs still work
- [ ] No stale Fresh-only files remain in the production build
