CREATE TABLE IF NOT EXISTS likes (
	post_slug TEXT NOT NULL,
	visitor_hash TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (post_slug, visitor_hash)
);

CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	post_slug TEXT NOT NULL,
	author TEXT NOT NULL,
	body TEXT NOT NULL,
	visitor_hash TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS comments_post_created
	ON comments (post_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_visitor_created
	ON comments (visitor_hash, created_at DESC);
