# [4ster.dev](https://4ster.dev)

My personal website.

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
- The homepage groups posts into English and Spanish sections so readers can browse each language separately.
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

| Command            | Purpose                          |
| ------------------ | -------------------------------- |
| `pnpm run dev`     | Start development server         |
| `pnpm run build`   | Build for production             |
| `pnpm run preview` | Preview production build locally |
| `pnpm run lint`    | Format, lint, and type check     |

## Tech Stack

- **Frontend**: Daisyui 5 + Tailwind CSS 4 + Deno Fresh (Preact)
- **Deployment**: Cloudflare Pages

CI/CD handles automatic deployments on push to main.

## License

Apache 2.0
