const CACHE_PREFIX = "[cache]" as const

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

async function getKv(): Promise<Deno.Kv | null> {
  if (typeof Deno === "undefined" || typeof Deno.openKv !== "function") return null
  return await Deno.openKv()
}

export async function cached<T>(prefix: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const kv = await getKv()
  if (!kv) return await fetcher()

  const key = [CACHE_PREFIX, prefix]
  const entry = await kv.get<CacheEntry<T>>(key)

  if (entry.value && Date.now() < entry.value.expiresAt) {
    return entry.value.data
  }

  const data = await fetcher()
  await kv.set(key, { data, expiresAt: Date.now() + ttlMs })
  return data
}

export async function invalidate(key: string): Promise<void> {
  const kv = await getKv()
  if (!kv) return
  await kv.delete([CACHE_PREFIX, key])
}

export async function invalidateAll(): Promise<number> {
  const kv = await getKv()
  if (!kv) return 0

  const iterator = kv.list({ prefix: [CACHE_PREFIX] })
  let count = 0

  const deleteNext = (): Promise<number> =>
    iterator.next().then(async (result) => {
      if (result.done) return count
      count += 1
      return await kv.delete(result.value.key).then(deleteNext)
    })

  return deleteNext()
}
