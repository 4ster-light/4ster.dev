import { extract } from "@std/front-matter/yaml"
import { createMarkedInstance } from "$lib/utils/marked"

const marked = createMarkedInstance()

export type PostMeta = {
  title: string
  description: string
  date: string
  tags: string[]
  "is-preview"?: boolean
  "header-image"?: boolean
}

export type Post = PostMeta & {
  slug: string
  content: string
}

type DirectoryItem = {
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
        content: marked.parse(body)
      } as Post
    }).catch((error) => {
      throw new Error(`Failed to fetch post content for ${dirName}: ${error}`)
    })
}

export default async function fetchPosts(githubToken: string): Promise<Post[]> {
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
    .then((directories: DirectoryItem[]) =>
      Promise.all(
        directories
          .filter((dir) => dir.type === "dir")
          .map(async (dir) => await fetchPostContent(dir.name, githubToken))
      ).then((posts) =>
        posts.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
      )
    ).catch((error) => {
      throw new Error(`GitHub API posts request failed: ${error}`)
    })
}
