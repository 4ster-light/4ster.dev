<div align="center">

# [4ster.dev](https://4ster.dev)

[![CI](https://github.com/4ster-light/4ster.dev/actions/workflows/ci.yml/badge.svg?branch=main&event=push)](https://github.com/4ster-light/http/actions/workflows/ci.yml)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-EA4AAA?logo=githubsponsors)](https://github.com/sponsors/4ster-light)
[![Other sponsorship options](https://img.shields.io/badge/Other%20Sponsorship%20options-%204ster.dev-blue)](https://4ster.dev/sponsor)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

</div>

<br />

## Blog content conventions

Blog posts live in `src/content/posts/` and use frontmatter metadata.

Required / supported fields:

- `title`: post title
- `description`: short summary
- `date`: publication date
- `lang`: `en` or `es`
- `translationKey`: optional shared key used to pair translated versions of the same post
- `tags`: optional tag list
- `is-preview`: optional boolean for unpublished draft posts

### Bilingual workflow

- Use `lang: "en"` for English posts and `lang: "es"` for Spanish posts.
- If a post exists in both languages, give both files the same `translationKey`.
- Locale-aware post URLs are generated automatically.
- The homepage groups posts into English and Spanish sections so readers can browse each language
  separately.
- Legacy `/posts/[slug]` URLs still redirect to the locale route.

### Example

```mdoc
---
title: "Hello World!"
description: "..."
date: 2024-12-01
lang: "en"
translationKey: "hello-world"
tags: ["personal"]
---
```

## Available Commands

| Command            | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `pnpm run dev`     | Start development server                         |
| `pnpm run build`   | Sync content, build, and regenerate worker types |
| `pnpm run preview` | Build and preview the production build locally   |
| `pnpm run fmt`     | Format files with Biome                          |
| `pnpm run lint`    | Lint and apply safe fixes with Biome             |
| `pnpm run check`   | Sync content and run `astro check`               |
| `pnpm run sync`    | Regenerate Astro content types                   |
| `pnpm run types`   | Regenerate worker types (run after a build)      |

Formatting and linting use [Biome](https://biomejs.dev/) (`biome.json`); package management uses
pnpm.

## Social preview image

`public/og.png` is generated from `src/assets/og.svg`. Social platforms don't render SVG
`og:image` files, so the raster version is the one that is served. To regenerate it after editing
the SVG:

```sh
# Inter is served from public/fonts; install it so the renderer can use it
cp public/fonts/Inter-*.ttf ~/.local/share/fonts/ && fc-cache -f
firefox --headless --window-size=1200,630 \
  --screenshot=public/og.png "file://$PWD/src/assets/og.svg"
```

## Tech Stack

- **Frontend**: Daisyui 5 + Tailwind CSS 4 + Astro
- **Deployment**: Cloudflare Pages

CI/CD handles automatic deployments on push to main.

## License

- **Site content** (blog posts, `src/content/posts/*`, in both English and Spanish):
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See
  <https://4ster.dev/license> for details.
- **Source code** (everything else in this repository): Apache 2.0, see `LICENSE`.
