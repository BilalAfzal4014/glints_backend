import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('collection_restaurant_mapping', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('collection_id').unsigned().references('id').inTable('collection');
        t.integer('restaurant_id').unsigned().references('id').inTable('restaurant');

        t.dateTime('created_at').notNullable();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('collection_restaurant_mapping');
}

