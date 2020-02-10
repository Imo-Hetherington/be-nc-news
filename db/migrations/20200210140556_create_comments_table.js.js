exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable.text("body").notNullable();
    commentsTable.integer("belongs_to").references("articles.article_id");
    commentsTable.string("created_by").references("users.username");
    commentsTable.timestamp("created_at");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
