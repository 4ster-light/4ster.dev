export default function ReposCard() {
  return (
    <div class="alert alert-info bg-primary/10 border-primary/20 p-5 flex justify-center">
      <div class="gap-3 items-center text-center">
        <p class="text-base-content/80 mb-2">
          Want to see more? Visit my GitHub page for all my repositories and contributions.
        </p>
        <a
          href="https://github.com/4ster-light?tab=repositories"
          target="_blank"
          rel="noopener"
          class="btn btn-sm btn-primary"
        >
          View All Repositories on GitHub →
        </a>
      </div>
    </div>
  )
}
