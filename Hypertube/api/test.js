const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.get('/', (req, res) => {
  fetch(`https://yts.am/api/v2/list_movies.json?query_term=${req.query.query}`)
    .then(a => a.json())
    .then(data => res.json(data))
})

app.listen(5000)

