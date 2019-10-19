exports.up = knex =>
  knex.schema.table('users', table => {
    table.string('emailToken').unique()
    table.boolean('emailVerified').defaultTo(false).notNullable()
  })

exports.down = knex =>
  knex.schema.table('users', table => {
    table.dropColumn('emailToken')
    table.dropColumn('emailVerified')
  })
