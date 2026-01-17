import { extract } from "@std/front-matter/yaml"
import marked from "@/lib/marked.ts"

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
    .then((response) => response.text())
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
    .catch((error) => {
      throw new Error(`GitHub API post content request failed: ${error}`)
    })
}

export async function fetchPosts(githubToken: string): Promise<Post[]> {
  return await fetch("https://api.github.com/repos/4ster-light/blog/contents/", {
    method: "GET",
    redirect: "follow",
    headers: new Headers({
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-blog"
    })
  })
    .then((response) => response.json())
    .then((data: DirectoryItem[]) =>
      Promise.all(
        data
          .filter((dir) => dir.type === "dir")
          .map((dir) => fetchPostContent(dir.name, githubToken))
      ).then((posts) =>
        posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
      )
    )
    .catch((error) => {
      throw new Error(`GitHub API posts request failed: ${error}`)
    })
}
