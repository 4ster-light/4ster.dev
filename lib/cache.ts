const kv = await Deno.openKv()

const CACHE_PREFIX = "[cache]" as const
export const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry {
  compressed: Uint8Array
  expiresAt: number
}

// Compress JSON data using gzip
async function compress(data: unknown): Promise<Uint8Array> {
  const json = JSON.stringify(data)
  const stream = new Blob([json]).stream()
  const compressed = stream.pipeThrough(new CompressionStream("gzip"))
  const buf = await new Response(compressed).arrayBuffer()
  return new Uint8Array(buf)
}

// Decompress gzip data back to JSON
async function decompress<T>(data: Uint8Array): Promise<T> {
  const stream = new Blob([data as BlobPart]).stream()
  const decompressed = stream.pipeThrough(new DecompressionStream("gzip"))
  const json = await new Response(decompressed).text()
  return JSON.parse(json) as T
}

// Store compressed items in cache, tracking which items were successfully cached
async function storeCachedItems<T>(
  prefix: string,
  items: T[],
  ttlMs: number,
  keyExtractor: (item: T) => string,
  indexKey: string[]
): Promise<void> {
  const expiresAt = Date.now() + ttlMs

  const results = await Promise.all(
    items.map((item) =>
      compress(item)
        .then((compressed) =>
          kv
            .set([...CACHE_PREFIX, prefix, keyExtractor(item)], {
              compressed,
              expiresAt
            })
            .then(() => keyExtractor(item))
        )
        .catch((err: Error) => {
          console.warn(`${CACHE_PREFIX} SKIP item (too large): ${keyExtractor(item)}`, err.message)
          return null
        })
    )
  )

  const successfullyStored = results.filter((key) => key !== null)

  // Only store the index if at least some items were cached successfully
  if (successfullyStored.length > 0) {
    await compress(successfullyStored).then((compressed) =>
      kv.set(indexKey, { compressed, expiresAt })
    )
  }
}

// Cache an array of items individually by a key extractor
export async function cachedArray<T>(
  prefix: string,
  ttlMs: number,
  keyExtractor: (item: T) => string,
  fetcher: () => Promise<T[]>
): Promise<T[]> {
  const indexKey = [...CACHE_PREFIX, prefix, "_index"]

  const indexEntry = await kv.get<CacheEntry>(indexKey)

  // Check if valid cache exists
  if (indexEntry.value && Date.now() < indexEntry.value.expiresAt) {
    const keys = await decompress<string[]>(indexEntry.value.compressed)
    console.log(`${CACHE_PREFIX} HIT: ${prefix} (${keys.length} items)`)

    const items = await Promise.all(
      keys.map((itemKey) =>
        kv
          .get<CacheEntry>([...CACHE_PREFIX, prefix, itemKey])
          .then((entry) => (entry.value ? decompress<T>(entry.value.compressed) : undefined))
      )
    )

    // If all items are available, return them
    if (!items.some((item) => item === undefined)) return items as T[]

    // Otherwise, some items expired; treat as cache miss and refetch
    console.log(`${CACHE_PREFIX} PARTIAL HIT: ${prefix} (some items expired, re-fetching)`)
  }

  // Cache miss - fetch fresh data
  console.log(`${CACHE_PREFIX} MISS: ${prefix}`)
  const items = await fetcher()

  await storeCachedItems(prefix, items, ttlMs, keyExtractor, indexKey)

  return items
}

export async function invalidate(key: string): Promise<void> {
  console.log(`${CACHE_PREFIX} INVALIDATE: ${key}`)
  // Delete the key itself
  const mainDelete = await kv.delete([...CACHE_PREFIX, key])

  // Also delete any sub-keys (for cachedArray)
  const iterator = kv.list({ prefix: [...CACHE_PREFIX, key] })
  const deleteSubKeys = ((): Promise<void> => {
    const deleteNext = (): Promise<void> =>
      iterator.next().then(async (result) => {
        if (result.done) return
        return await kv.delete(result.value.key).then(deleteNext)
      })
    return deleteNext()
  })()

  await Promise.all([mainDelete, deleteSubKeys])
}

export function invalidateAll(): Promise<number> {
  console.log(`${CACHE_PREFIX} INVALIDATE ALL`)
  const iterator = kv.list({ prefix: [...CACHE_PREFIX] })
  let count = 0

  const deleteNext = (): Promise<number> =>
    iterator.next().then(async (result) => {
      if (result.done) return count
      count++
      return await kv.delete(result.value.key).then(deleteNext)
    })

  return deleteNext()
}
