exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.uuid('id').primary().notNullable()
    table.string('email').unique().notNullable()
    table.string('username').unique().notNullable()
    table.string('picture').notNullable()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.text('password').notNullable()
  })

exports.down = knex =>
  knex.schema.dropTable('users')
