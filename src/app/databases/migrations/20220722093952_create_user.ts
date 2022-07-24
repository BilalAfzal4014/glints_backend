import {Knex} from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', function (t) {
        t.increments('id').unsigned().primary();
        t.string('name').notNullable();
        t.string('email').notNullable().unique();
        t.string('password').notNullable();

        t.dateTime('created_at').notNullable();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user');
}

