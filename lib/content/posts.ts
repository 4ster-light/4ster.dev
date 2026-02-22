import { extract } from "@std/front-matter/yaml"
import marked from "@/lib/marked.ts"
import { cachedArray } from "@/lib/cache.ts"

export interface PostMeta {
  title: string
  description: string
  date: string
  tags: string[]
  "is-preview"?: boolean
  "header-image"?: boolean
}

export interface Post extends PostMeta {
  slug: string
  content: string
}

interface DirectoryItem {
  name: string
  type: string
  download_url: string
}

const POSTS_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

async function fetchPostContent(
  dirName: string,
  githubToken: string
): Promise<Post> {
  return await fetch(
    `https://api.github.com/repos/4ster-light/blog/contents/${dirName}/content.md`,
    {
      method: "GET",
      redirect: "follow",
      headers: new Headers({
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "4ster-dev-blog"
      })
    }
  )
    .then((response) => response.ok ? response.text() : Promise.reject(response.statusText))
    .then((fileContent) => {
      const { attrs, body } = extract<PostMeta>(fileContent)
      return {
        slug: dirName,
        title: attrs.title,
        description: attrs.description,
        date: attrs.date,
        tags: attrs.tags || [],
        "is-preview": attrs["is-preview"] || false,
        "header-image": attrs["header-image"] || false,
        content: marked.parse(body) as string
      }
    })
    .catch(() => Promise.reject(`Failed to fetch post: ${dirName}`))
}

async function fetchPostsFromGitHub(githubToken: string): Promise<Post[]> {
  return await fetch("https://api.github.com/repos/4ster-light/blog/contents/", {
    method: "GET",
    redirect: "follow",
    headers: new Headers({
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-blog"
    })
  })
    .then((response) => response.ok ? response.json() : Promise.reject(response.statusText))
    .then((data: DirectoryItem[]) =>
      Promise.allSettled(
        data
          .filter((dir) => dir.type === "dir")
          .map((dir) => fetchPostContent(dir.name, githubToken))
      ).then((results) =>
        results
          .filter((result) => result.status === "fulfilled")
          .map((result) => (result as PromiseFulfilledResult<Post>).value)
          .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
      )
    )
    .catch((error) => Promise.reject(`Failed to fetch posts: ${error}`))
}

export function fetchPosts(githubToken: string): Promise<Post[]> {
  return cachedArray(
    "posts",
    POSTS_CACHE_TTL,
    (post) => post.slug,
    () => fetchPostsFromGitHub(githubToken)
  )
}
