exports.up = knex =>
  knex.schema.table('users', table => {
    table.boolean('isAdult').defaultTo(false)
  })

exports.down = knex =>
  knex.schema.table('users', table => {
    table.dropColumn('isAdult')
  })
