import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('restaurant_timing', function (t) {
        t.increments('id').unsigned().primary();
        t.integer('restaurant_id').unsigned().references('id').inTable('restaurant');
        t.enum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).notNullable();
        t.string('opening_time').notNullable();
        t.string('closing_time').notNullable();

        t.dateTime('created_at').notNullable();
        t.dateTime('updated_at').nullable();
        t.dateTime('deleted_at').nullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('restaurant_timing');

}

