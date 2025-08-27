# 📝 Blog

[![Built with the Deno Standard Library](https://img.shields.io/badge/Built_with_std-black?logo=deno)](https://jsr.io/@std)

My personal blog where I share my technical posts.

## 🚀 Getting Started

```bash
deno install --allow-scripts
deno task dev
```

As you can see you will need to have installed the `deno runtime`, besides using it as package
manager the page makes use of its specific APIs.

It is rolled as a custom SSG where the posts are stored in a `posts.json` file in the static
directory already parsed as html at build time along with its metadata and then each page is
prerendered. The script in charge of this is
[./scripts/generate_posts.ts](https://github.com/4ster-light/blog/blob/main/scripts/generate_posts.ts).

## 📄 LICENSE

Apache License 2.0

## 💝 Sponsor

If you like this project, consider supporting me by buying me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B41HVJUR)
