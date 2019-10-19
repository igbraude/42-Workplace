exports.up = knex =>
  knex.schema.createTable('movies', table => {
    table.string('id', 9).primary().notNullable()
    table.text('primaryTitle')
    table.text('originalTitle')
    table.boolean('adult')
    table.integer('year')
    table.integer('minutes')
    table.specificType('genres', 'text[]')
    table.float('rating')
    table.integer('votes')
    table.text('description')
    table.text('poster')
  })

exports.down = knex =>
  knex.schema.dropTable('movies')

