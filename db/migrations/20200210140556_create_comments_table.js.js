exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.text("body").notNullable();
    commentsTable.integer("votes").defaultTo(0);
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentsTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
