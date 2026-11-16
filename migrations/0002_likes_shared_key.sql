-- Likes follow a translation pair, so they are keyed by a stable interaction
-- key (the post's `translationKey`, or its id when untranslated) instead of the
-- language specific slug. Comments stay keyed by `post_slug`, which keeps each
-- language's discussion separate.
--
-- The table was verified empty in production before this migration, so it is
-- recreated rather than migrated row by row.
DROP TABLE IF EXISTS likes;

CREATE TABLE likes (
	post_key TEXT NOT NULL,
	visitor_hash TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (post_key, visitor_hash)
);
