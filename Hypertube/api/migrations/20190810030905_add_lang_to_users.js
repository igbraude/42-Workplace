exports.up = knex =>
    knex.schema.table('users', table => {
        table
            .enum('lang', ['french', 'english'])
            .defaultTo('english')
            .notNullable()
    })

exports.down = knex =>
    knex.schema.table('users', table => {
        table.dropColumn('lang')
    })
