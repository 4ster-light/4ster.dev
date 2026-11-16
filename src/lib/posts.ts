import type { CollectionEntry } from "astro:content"
import type { FeedPost } from "./feed.ts"
import type { Lang } from "./site.ts"

export type Post = CollectionEntry<"posts">

export const postLang = (post: Post): Lang => post.data.lang

/**
 * Likes are shared across a translation pair, so they are keyed by the
 * `translationKey` when one exists and by the post id otherwise. Comments stay
 * keyed by the post id, which keeps each language's thread separate.
 */
export const interactionKey = (post: Post): string =>
	post.data.translationKey ?? post.id

export const publishedPosts = (posts: Post[]): Post[] =>
	posts
		.filter((post) => !post.data["is-preview"])
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())

export const toFeedPost = (post: Post): FeedPost => ({
	id: post.id,
	title: post.data.title,
	description: post.data.description,
	date: post.data.date,
	lang: postLang(post),
	tags: post.data.tags
})

export const findTranslation = (
	post: Post,
	posts: Post[]
): Post | undefined => {
	if (!post.data.translationKey) return undefined
	return posts.find(
		(entry) =>
			entry.id !== post.id &&
			entry.data.translationKey === post.data.translationKey &&
			postLang(entry) !== postLang(post)
	)
}
