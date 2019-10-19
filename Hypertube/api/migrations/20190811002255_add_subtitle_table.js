exports.up = knex =>
    knex.schema.createTable('subtitles', table => {
        table.uuid('id').primary().notNullable()
        table.string('imdb', 7).notNullable()
        table.string('lang').notNullable()
        table.string('file').notNullable()
    })

exports.down = knex =>
    knex.schema.dropTable('subtitles')
