exports.up = knex =>
  knex.schema.createTable('movies_actors', table => {
    table.uuid('id').primary().notNullable()
    table.string('movieId').notNullable()
    table.string('actorId').notNullable()
    table.integer('order')
    table.text('category')
  })

exports.down = knex =>
  knex.schema.dropTable('movies_actors')
