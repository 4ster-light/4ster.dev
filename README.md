# Blog

My personal blog where I share my technical posts, in order to run it locally:

```bash
pnpm i
deno task dev
```

As you can see you will need to have installed the pnpm package manager and the deno runtime,
specially the last one since the page makes use of its specific APIs.

It is rolled as a custom SSG where the posts are stored in a `posts.json` file in the static
directory already parsed as html at build time along with its metadata and then served directly at
runtime. The script in charge of this is
[scripts/generate_posts.ts](https://github.com/4ster-light/blog/blob/main/scripts/generate_posts.ts).

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B41HVJUR)
