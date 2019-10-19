exports.up = knex =>
  knex.schema.createTable('actors', table => {
    table.string('id').primary().notNullable()
    table.text('name')
    table.integer('birthYear')
    table.integer('deathYear')
    table.specificType('knownForMovies', 'text[]')
  })

exports.down = knex =>
  knex.schema.dropTable('actors')
