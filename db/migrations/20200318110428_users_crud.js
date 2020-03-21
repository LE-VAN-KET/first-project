
exports.up = function(knex) {
    return knex.schema.createTable('table_users', function(table) {
        table.increments('id')
        table.string('name', 255).notNullable()
        table.string('email', 255).unique().notNullable()
        table.string('password', 255).notNullable()
        table.string('address', 255).notNullable()
        table.timestamps(false, true)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('table_users')
};
