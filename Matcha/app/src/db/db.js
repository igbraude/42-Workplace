const pg = require('pg')

module.exports = new pg.Pool({
  host: process.env['DB_HOST'] || 'localhost',
  user: 'matcha',
  database: 'matcha',
  password: 'matcha',
  port: 5432,
});