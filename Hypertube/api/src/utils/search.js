import fetch from "node-fetch"

let cache = []

export const search = async query => {
    cache = cache.filter((curr) => Date.now() - curr.at < 3600000)
    const cacheResult = cache
        .find((curr) => query === curr.query)
    if (cacheResult) {
        return cacheResult.result
    }
    const movies = await fetch(`http://51.15.244.251:5000?query=${query}`)
    const data = await movies.json()
    if (!data.data || !data.data.movies) {
        return []
    }
    const links = data.data.movies.flatMap(({ title, torrents = [] }) =>
        torrents.map(({ hash, quality, size, seeds: seeders, peers: leechers }) => ({
            title,
            hash,
            quality,
            size,
            seeders,
            leechers,
        })),
    )
    cache = [...cache, { query, at: Date.now(), result: links }]
    return links
}
