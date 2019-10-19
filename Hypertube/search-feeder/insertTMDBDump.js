const db = require('./database')
const tmdb = require('./tmdb_dump')

const run = async () => {
    await db.connect()
    await Promise.all(
        Object.entries(tmdb)
            .filter(([id]) => !!id)
            .map(([id, { summary, poster }]) => db.query(`
                UPDATE movies SET description = $2, poster = $3
                WHERE id = $1
            `, [id, summary, poster]))
    )
    await db.end()
}

run().catch(console.error)
