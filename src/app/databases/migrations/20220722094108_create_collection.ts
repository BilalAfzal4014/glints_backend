import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('collection', function (t) {
        t.increments('id').unsigned().primary();
        t.string('name').notNullable();
        t.integer('user_id').unsigned().references('id').inTable('user');

        t.dateTime('created_at').notNullable();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('collection');
}

