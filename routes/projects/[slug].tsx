import { Head } from "fresh/runtime"
import { define } from "@/utils.ts"
import { fetchRepositories, type Repository } from "@/lib/content/repositories.ts"
import urls from "@/lib/urls.ts"
import ButtonLink from "@/components/ButtonLink.tsx"
import { page } from "fresh"

function SEO({ repository }: { repository: Repository }) {
  const description = repository.description ||
    `${repository.name} - Open source project`

  return (
    <Head>
      <title>{repository.name} - ✰λster✰</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css"
      />
      <meta name="author" content="David Vivar Bogónez" />
      <meta name="description" content={description} />

      <meta property="og:title" content={repository.name} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={repository.url} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={urls.bannerUrl} />

      <meta name="twitter:title" content={repository.name} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.bannerUrl} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

interface PageData {
  repository?: Repository
}

export const handler = define.handlers({
  async GET(ctx) {
    const githubToken = Deno.env.get("GH_API") || ""

    const repositories = await fetchRepositories(githubToken)
    const repository = repositories.find((r: Repository) => r.name === ctx.params.slug)

    return repository
      ? page<PageData>({ repository })
      : page<PageData>({ repository: undefined }, { status: 404 })
  }
})

export default define.page<typeof handler>(async (ctx) => {
  const { repository } = ctx.data

  if (!repository) {
    return (
      <div class="text-center py-16">
        <h1 class="text-3xl font-bold mb-4 text-error">Project Not Found</h1>
        <p class="text-base-content/70 mb-6">
          The project you're looking for doesn't exist.
        </p>
        <ButtonLink href={urls.projectsUrl} target="">
          <img
            src={(await import("@/assets/icons/LeftArrows.svg")).default}
            alt="Left Arrows"
            class="size-8"
          />
        </ButtonLink>
      </div>
    )
  }

  return (
    <div>
      <SEO repository={repository} />

      <article class="mb-8">
        <div class="mb-8">
          <h3 class="text-xl font-bold mb-4">Repository Information</h3>
          <div class="overflow-x-auto">
            <table class="table table-compact border border-base-200">
              <tbody>
                <tr>
                  <th class="text-left">Language</th>
                  <td>{repository.language || "Not specified"}</td>
                </tr>
                <tr>
                  <th class="text-left">Stars</th>
                  <td>{repository.stars}</td>
                </tr>
                <tr>
                  <th class="text-left">Forks</th>
                  <td>{repository.forks}</td>
                </tr>
                <tr>
                  <th class="text-left">Last Updated</th>
                  <td>{repository.updated_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-8 flex gap-2">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener"
            class="btn w-full"
          >
            View on GitHub
          </a>
        </div>

        <section
          class="prose mt-4 card card-border rounded-2xl p-8 bg-info/5"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: repository.readme! }}
        />

        <div class="divider"></div>

        <footer class="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <ButtonLink href={urls.projectsUrl} target="">
            <img
              src={(await import("@/assets/icons/LeftArrows.svg")).default}
              alt="Left Arrows"
              class="size-8"
            />
          </ButtonLink>
          <ButtonLink href={urls.githubSponsorsUrl}>
            <img
              src={(await import("@/assets/icons/CreditCard.svg")).default}
              alt="Sponsor"
              class="size-6"
            />{" "}
            Sponsor
          </ButtonLink>
        </footer>
      </article>
    </div>
  )
})
