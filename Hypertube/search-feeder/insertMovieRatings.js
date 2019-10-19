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
            const [id, rating, votes] = line.split('\t')
            count++
            if (id.length === 9) {
                db.query(`
                    UPDATE movies SET rating = $2, votes = $3
                    WHERE id = $1
                `, [id, parseFloat(rating), parseInt(votes, 10)])
                    .then(() => {
                        if (++done >= count) {
                            resolve()
                        }
                    }).catch(reject)
            }
        })
        reader.on('error', reject)
        reader.on('close', () => console.log('Read done'))
    })
    await db.end()
}

run().catch(console.error)
