import 'dotenv/config';
import type {Knex} from "knex";
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
    development: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_port ? +process.env.DB_port : 3306,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: process.env.DB_MIN_POOL ? +process.env.DB_MIN_POOL : 3,
            max: process.env.DB_MAX_POOL ? +process.env.DB_MAX_POOL : 7
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './src/app/databases/migrations'
        },
        seeds: {
            directory: './src/app/databases/seeds'
        }
    }

};

module.exports = config;
