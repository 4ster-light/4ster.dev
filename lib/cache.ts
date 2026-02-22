const kv = await Deno.openKv()

const CACHE_PREFIX = ["cache"] as const

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

// Cache an array of items individually by a key extractor
export async function cachedArray<T>(
  prefix: string,
  ttlMs: number,
  keyExtractor: (item: T) => string,
  fetcher: () => Promise<T[]>
): Promise<T[]> {
  const indexKey = [...CACHE_PREFIX, prefix, "_index"]

  return await kv.get<CacheEntry>(indexKey)
    .then(async (indexEntry): Promise<T[]> => {
      // Check if index exists and is valid
      if (indexEntry.value && Date.now() < indexEntry.value.expiresAt) {
        return await decompress<string[]>(indexEntry.value.compressed)
          .then((keys) => {
            console.log(`[cache] HIT: ${prefix} (${keys.length} items)`)
            return Promise.all(
              keys.map(async (itemKey) =>
                await kv.get<CacheEntry>([...CACHE_PREFIX, prefix, itemKey])
                  .then((entry) => entry.value ? decompress<T>(entry.value.compressed) : undefined)
              )
            )
          })
          .then((items) => {
            // If any item is missing (expired), treat as cache miss
            if (items.some((item) => item === undefined)) {
              console.log(`[cache] PARTIAL HIT: ${prefix} (some items expired, re-fetching)`)
              throw new Error("Cache miss: expired item")
            }
            return items as T[]
          })
          .catch(async (): Promise<T[]> => {
            // Fall back to re-fetching if any item is missing
            console.log(`[cache] MISS: ${prefix} (fallback from partial hit)`)
            return await fetcher().then(async (items) => {
              const expiresAt = Date.now() + ttlMs
              const keys = items.map(keyExtractor)

              // Compress and store each item individually + the index
              await Promise.all([
                compress(keys).then(async (compressed) =>
                  await kv.set(indexKey, { compressed, expiresAt })
                ),
                ...items.map((item) =>
                  compress(item).then(async (compressed) =>
                    await kv.set([...CACHE_PREFIX, prefix, keyExtractor(item)], {
                      compressed,
                      expiresAt
                    })
                      .catch((err: Error) => {
                        console.warn(
                          `[cache] SKIP item (too large): ${keyExtractor(item)}`,
                          err.message
                        )
                      })
                  )
                )
              ])
              return items
            })
          })
      }

      // Cache miss - fetch fresh data
      console.log(`[cache] MISS: ${prefix}`)
      return fetcher().then(async (items) => {
        const expiresAt = Date.now() + ttlMs
        const keys = items.map(keyExtractor)

        // Compress and store each item individually + the index
        await Promise.all([
          compress(keys).then(async (compressed) =>
            await kv.set(indexKey, { compressed, expiresAt })
          ),
          ...items.map((item) =>
            compress(item).then(async (compressed) =>
              await kv.set([...CACHE_PREFIX, prefix, keyExtractor(item)], {
                compressed,
                expiresAt
              })
                .catch((err: Error) => {
                  console.warn(
                    `[cache] SKIP item (too large): ${keyExtractor(item)}`,
                    err.message
                  )
                })
            )
          )
        ])
        return items
      })
    })
}

export async function invalidate(key: string): Promise<void> {
  console.log(`[cache] INVALIDATE: ${key}`)
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

  return Promise.all([mainDelete, deleteSubKeys]).then(() => {})
}

export function invalidateAll(): Promise<number> {
  console.log("[cache] INVALIDATE ALL")
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
