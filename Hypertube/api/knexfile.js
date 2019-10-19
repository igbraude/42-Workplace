// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'hypertube',
      password: process.env.DB_PASSWORD || 'hypertube',
      database: process.env.DB_DATABASE || 'hypertube',
      port: process.env.DB_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'hypertube',
      password: process.env.DB_PASSWORD || 'hypertube',
      database: process.env.DB_DATABASE || 'hypertube',
      port: process.env.DB_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
