exports.up = knex =>
  knex.schema.createTable('stream_watch_times', table => {
    table.uuid('id').primary().notNullable()
    table.uuid('userId').notNullable()
    table.uuid('streamId').notNullable()
    table.float('duration').notNullable()
  })

exports.down = knex =>
  knex.schema.dropTable('stream_watch_times')
