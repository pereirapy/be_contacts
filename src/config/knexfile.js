module.exports = {
  development: {
    client: 'pg',
    debug: true,
    connection: {
      database: 'contacts',
      user: 'postgres',
      password: '52425242'
    },
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    client: 'postgresql',
    connection: {
      database: 'contacts-test',
      user: 'postgres',
      password: '52425242'
    },
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/config/migrations'
    },
    seeds: {
      tableName: 'knex_seeds',
      directory: './src/config/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
    dialectOptions: {
      ssl: true
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      tableName: 'knex_seeds'
    },
    port: 5432,
    define: {
      charset: 'utf8',
      dialectOptions: { collate: 'utf8_general_ci' }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}
