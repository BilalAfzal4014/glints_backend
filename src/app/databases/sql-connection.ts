import Knex from "knex";
import {Model, transaction} from "objection";

const knex = Knex({
    client: process.env.DB_CLIENT,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    pool: {
        min: process.env.DB_MIN_POOL ? +process.env.DB_MIN_POOL : 3,
        max: process.env.DB_MAX_POOL ? +process.env.DB_MAX_POOL : 7,
        afterCreate: function (_: Function, done: Function) {
            done();
        },
    },
    acquireConnectionTimeout: process.env.DB_CONNECTION_TIMEOUT ? +process.env.DB_CONNECTION_TIMEOUT : 10000,
});

Model.knex(knex);

const establishDatabaseConnection = async () => {
    const CONNECTION_CHECK_QUERY = "SELECT 1+1 as result";

    await knex.raw(CONNECTION_CHECK_QUERY);
    console.log("Mysql connection established successfully");

    return Promise.resolve();
};

export {
    knex,
    Model,
    transaction,
    establishDatabaseConnection,
};