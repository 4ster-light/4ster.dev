import { page } from "fresh"
import { Head } from "fresh/runtime"
import ButtonLink from "@/components/ButtonLink.tsx"
import { fetchRepositories, type Repository } from "@/lib/content/repositories.ts"
import urls, { ogImage } from "@/lib/urls.ts"
import { define } from "@/utils.ts"
import ReposCard from "@/components/ReposCard.tsx"

function SEO({ repository }: { repository: Repository }) {
  const description = repository.description || `${repository.name} - Open source project`
  const image = ogImage(repository.name, { subtitle: description, type: "project" })

  return (
    <Head>
      <title>{repository.name} - ✰λster✰</title>
      <meta name="author" content="David Vivar Bogónez" />
      <meta name="description" content={description} />

      <meta property="og:title" content={repository.name} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={repository.url} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={repository.name} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={image} />
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
      <div class="text-center py-16 flex flex-col gap-6">
        <h1 class="text-3xl font-bold text-error">Project Not Found</h1>
        <p class="text-base-content/70">The project you're looking for doesn't exist.</p>
        <div>
          <ButtonLink href={urls.projects} target="">
            <img
              src={(await import("@/assets/icons/LeftArrows.svg")).default}
              alt="Left Arrows"
              class="size-8"
            />
          </ButtonLink>
        </div>

        <ReposCard />
      </div>
    )
  }

  return (
    <div>
      <SEO repository={repository} />

      <article class="flex flex-col gap-8">
        <h3 class="text-xl font-bold">Repository Information</h3>
        <div class="overflow-x-auto">
          <table class="table table-xs sm:table-sm border border-base-200">
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

        <a href={repository.url} target="_blank" rel="noopener" class="btn w-full">
          View on GitHub
        </a>

        <section
          class="prose prose-sm sm:prose-base card card-border rounded-2xl p-4 sm:p-8 bg-info/5 overflow-hidden"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: repository.readme || "" }}
        />

        <ReposCard />

        <footer class="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <div class="flex gap-2 sm:ml-auto">
            <ButtonLink href={urls.projects} target="">
              <img
                src={(await import("@/assets/icons/LeftArrows.svg")).default}
                alt="Left Arrows"
                class="size-8"
              />
            </ButtonLink>
            <ButtonLink href={urls.donate}>
              <img
                src={(await import("@/assets/icons/Love.svg")).default}
                alt="Sponsor"
                class="size-6"
              />{" "}
              Sponsor
            </ButtonLink>
          </div>
        </footer>
      </article>
    </div>
  )
})
