import { collection, config, fields } from "@keystatic/core"

export default config({
  storage: {
    kind: "github",
    repo: "4ster-light/4ster.dev"
  },
  collections: {
    posts: collection({
      label: "Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({
          name: { label: "Title" }
        }),
        description: fields.text({
          label: "Description"
        }),
        date: fields.date({
          label: "Date"
        }),
        lang: fields.select({
          label: "Language",
          options: [
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" }
          ],
          defaultValue: "en"
        }),
        translationKey: fields.text({
          label: "Translation Key"
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "Tag"
        }),
        "is-preview": fields.checkbox({
          label: "Preview",
          defaultValue: false
        }),
        body: fields.markdoc({
          label: "Body",
          options: {
            image: {
              directory: "public/uploads",
              publicPath: "/uploads"
            }
          }
        })
      }
    })
  }
})
