# Project Commands

This project uses **Deno exclusively** for all development, build, and deployment tasks.

## **Available Commands**

| Command                        | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `deno task dev`                | Start the development server                                             |
| `deno task build`              | Build the project for production                                         |
| `deno task start`              | Preview the production environment locally                               |
| `deno task preview:{dev,prod}` | Preview the project in specified environment by tunneling to Deno Deploy |
| `deno task check`              | Format, lint and type check the entire codebase                          |
| `deno deploy`                  | Deploy the project to Cloudflare Pages                                   |

### **Notes**

- Deployment and preview use `deno deploy` for manual deployment but in most cases the CI handles
  it.
- Deno deploy is the target deployment platform.

# Git and GitHub

This project uses Git for version control and is hosted on GitHub.

When told to deploy manually, besides running `deno deploy`, also make sure first all changes are
committed with an appropiate message and pushed to the main branch.

## **Notes**

- Use meaningful commit messages for better project history, yet short human readable phrases.
  - This project follows the Conventional Commits specification for commit messages.
- Before pushing changes, ensure the code passes all checks by running `deno task check`.
