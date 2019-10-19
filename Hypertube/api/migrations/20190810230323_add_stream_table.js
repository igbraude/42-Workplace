exports.up = knex =>
    knex.schema.createTable('streams', table => {
        table.uuid('id').primary().notNullable()
        table.text('magnet').unique().notNullable()
        table.string('imdb', 7).notNullable()
        table.string('file')
        table.integer('resolution')
        table.float('duration')
        table.bigint('size')
        table.timestamp('lastView')
    })

exports.down = knex =>
    knex.schema.dropTable('streams')
