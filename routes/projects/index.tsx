import { Head } from "fresh/runtime"
import { page } from "fresh"
import { define } from "@/utils.ts"
import { fetchRepositories, type Repository } from "@/lib/content/repositories.ts"
import urls from "@/lib/urls.ts"
import ButtonLink from "@/components/ButtonLink.tsx"

function SEO() {
  return (
    <Head>
      <title>Projects - ✰λster✰</title>
      <meta name="description" content="Open source projects by Aster" />
      <meta name="author" content="David Vivar Bogónez" />

      <meta property="og:title" content="Projects - ✰λster✰" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Open source projects by Aster"
      />
      <meta property="og:url" content={`${urls.url}/projects`} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={urls.bannerUrl} />

      <meta name="twitter:title" content="Projects - ✰λster✰" />
      <meta
        name="twitter:description"
        content="Open source projects by Aster"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.bannerUrl} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

interface PageData {
  repositories?: Repository[]
}

export const handler = define.handlers({
  async GET(_ctx) {
    const githubToken = Deno.env.get("GH_API") || ""

    const repositories = await fetchRepositories(githubToken)

    return repositories
      ? page<PageData>({ repositories })
      : page<PageData>({ repositories: undefined }, { status: 404 })
  }
})

export default define.page<typeof handler>(async function Projects(ctx) {
  const { repositories } = ctx.data

  if (!repositories) {
    return (
      <>
        <SEO />

        <div class="text-center py-16">
          <h1 class="text-3xl font-bold mb-4 text-error">Projects Not Found</h1>
          <p class="text-base-content/70 mb-6">
            The projects you're looking for aren't loading right now.
          </p>
          <ButtonLink href={urls.url} target="">
            <img
              src={(await import("@/assets/icons/LeftArrows.svg")).default}
              alt="Left Arrows"
              class="size-8"
            />
          </ButtonLink>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO />

      <div class="space-y-4">
        {repositories.map((repo: Repository) => (
          <article
            key={repo.name}
            class="card card-border bg-base-100 hover:bg-base-200/40 transition-colors"
          >
            <div class="card-body p-5">
              <div class="flex flex-col md:flex-row md:justify-between md:items-baseline gap-3">
                <h3 class="card-title text-lg m-0">
                  <a
                    href={`/projects/${repo.name}`}
                    class="link link-hover link-primary"
                  >
                    {repo.name}
                  </a>
                </h3>
                <div class="flex gap-4 text-sm font-mono text-base-content/60">
                  <span>{repo.stars} ⭐</span>
                  <span>{repo.forks} forks</span>
                </div>
              </div>

              {repo.description && (
                <p class="text-sm text-base-content/70">
                  {repo.description}
                </p>
              )}

              <div class="flex gap-2 text-xs font-mono text-base-content/60 flex-wrap items-center">
                {repo.language && (
                  <span class="badge badge-sm badge-outline">
                    {repo.language}
                  </span>
                )}
                <span>Updated at {repo.updated_at}</span>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener"
                  class="btn btn-ghost btn-sm ml-auto"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div class="my-8"></div>

      <footer class="border-base-300 flex justify-end items-center gap-4 flex-col sm:flex-row">
        <ButtonLink href={urls.url} target="">
          <img
            src={(await import("@/assets/icons/LeftArrows.svg")).default}
            alt="Left Arrows"
            class="size-8"
          />
        </ButtonLink>
        <ButtonLink href={urls.kofiUrl}>
          <img
            src={(await import("@/assets/icons/CreditCard.svg")).default}
            alt="Buy me a Coffee"
            class="size-6"
          />{" "}
          Buy me a Coffee
        </ButtonLink>
      </footer>
    </>
  )
})
