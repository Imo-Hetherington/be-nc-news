exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique()
      .notNullable();
    usersTable.string("name").notNullable;
    usersTable.string("avatar").defaultTo("default-avatar.jpeg");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
