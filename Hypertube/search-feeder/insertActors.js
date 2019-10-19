const db = require('./database')

const parseYear = year => {
  const date = parseInt(year, 10)
  return isNaN(date) ? null : date
}

const run = async () => {
  await db.connect()
  await new Promise((resolve, reject) => {
    let count = 0
    let done = 0
    const reader = require('readline').createInterface({
      input: require('fs').createReadStream(process.env.FILE)
    })
    reader.on('line', (line) => {
      const [id, name, birthYear, deathYear, _, knownForTitles] = line.split('\t')
      count++
      db.query(`
          INSERT INTO actors (id, name, birthYear, deathYear, knownForMovies)
          VALUES ($1, $2, $3, $4, $5)
      `, [
          id,
          name !== '\\N' ? name : null,
          birthYear !== '\\N' ? parseYear(birthYear) : null,
          deathYear !== '\\N' ? parseYear(deathYear) : null,
          knownForTitles !== '\\N' ? knownForTitles.split(',') : [],
        ]).then(() => {
          if (++done >= count) {
            resolve()
          }
        }).catch(reject)
    })
    reader.on('error', reject)
    reader.on('close', () => console.log(`Read ${count} done`))
  })
  await db.end()
}

run().catch(console.error)
