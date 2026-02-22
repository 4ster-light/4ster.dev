# [4ster.dev](https://4ster.dev)

My personal website.

## Available Commands

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `deno task dev`   | Start development server         |
| `deno task build` | Build for production             |
| `deno task start` | Preview production build locally |
| `deno task check` | Format, lint, and type check     |

## Tech Stack

- **Frontend**: Daisyui 5 + Tailwind CSS 4 + Deno Fresh (Preact)
- **Deployment**: Deno Deploy
- **Caching**: Deno KV with TTL-based invalidation

CI/CD handles automatic deployments on push to main.

## Caching

Content from external sources (blog posts, GitHub repositories) is cached using Deno KV to reduce
API calls and improve response times.

| Content      | TTL     |
| ------------ | ------- |
| Blog posts   | 30 min  |
| Repositories | 2 hours |

Cache can be manually invalidated via a protected API endpoint, useful for forcing updates after
publishing new content.

## License

Apache 2.0
