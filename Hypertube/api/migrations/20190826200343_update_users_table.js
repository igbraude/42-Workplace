exports.up = knex =>
  knex.schema.table('users', table => {
    table.text('fourtyTwoId').unique().nullable()
    table.text('githubId').unique().nullable()
  })

exports.down = knex =>
  knex.schema.table('users', table => {
    table.dropColumn('fourtyTwoId')
    table.dropColumn('githubId')
  })
