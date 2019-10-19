const db = require('./database')

const run = async () => {
    await db.connect()
    await new Promise((resolve, reject) => {
        let count = 0
        let done = 0
        const reader = require('readline').createInterface({
            input: require('fs').createReadStream(process.env.FILE)
        })
        reader.on('line', (line) => {
            const [id, type, primaryTitle, originalTitle, adult, year, _, minutes, genres] = line.split('\t')
            if (type === "movie" && id.length === 9) {
                count++
                db.query(`
                    INSERT INTO movies (id, primaryTitle, originalTitle, adult, year, minutes, genres)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    id,
                    primaryTitle !== '\\N' ? primaryTitle : null,
                    originalTitle !== '\\N' ? originalTitle : null,
                    adult === '1',
                    year !== '\\N' ? parseInt(year) : null,
                    minutes !== '\\N' ? parseInt(minutes) : null,
                    genres !== '\\N' ? genres.toLowerCase().split(',') : [],
                ]).then(() => {
                    if (++done >= count) {
                        resolve()
                    }
                }).catch(reject)
            }
        })
        reader.on('error', reject)
        reader.on('close', () => console.log(`Read ${count} done`))
    })
    await db.end()
}

run().catch(console.error)
