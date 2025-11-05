# Project Commands

This project uses **Deno exclusively** for all development, build, and deployment tasks.

## **Available Commands**

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `deno task dev`    | Start the development server               |
| `deno task build`  | Build the project for production           |
| `deno task start`  | Preview the production environment locally |
| `deno task deploy` | Deploy the project to Cloudflare Pages     |
| `deno task check`  | Format and lint the entire codebase        |

### **Notes**

- Deployment and preview use `wrangler` (a dev dependency).
- Cloudflare Pages is the target deployment platform.

# Git and GitHub

This project uses Git for version control and is hosted on GitHub.

When told to deploy, besides running `deno task deploy`, also make sure first all changes are
committed with an appropiate message and pushed to the main branch.

## **Notes**

- Use meaningful commit messages for better project history, yet short human readable phrases.
- Ensure code is linted and formatted before committing changes.
