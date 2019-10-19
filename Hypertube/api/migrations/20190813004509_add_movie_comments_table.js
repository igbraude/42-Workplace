exports.up = knex =>
  knex.schema.createTable('movie_comments', table => {
    table.uuid('id').primary().notNullable()
    table.uuid('userId').notNullable()
    table.string('movieId').notNullable()
    table.string('comment').notNullable()
    table.timestamp('createdAt').notNullable()
  })

exports.down = knex =>
  knex.schema.dropTable('movie_comments')

