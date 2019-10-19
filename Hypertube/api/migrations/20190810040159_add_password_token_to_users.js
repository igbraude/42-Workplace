exports.up = knex =>
    knex.schema.table('users', table => {
        table.string('passwordToken')
    })

exports.down = knex =>
    knex.schema.table('users', table => {
        table.dropColumn('passwordToken')
    })
