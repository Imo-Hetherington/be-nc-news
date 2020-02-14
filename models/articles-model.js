const knex = require("../db/connection");

exports.fetchArticle = article_id => {
  return knex
    .select("articles.*")
    .count("comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .where("articles.article_id", article_id)
    .groupBy("articles.article_id")
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return rows;
    });
};

exports.updateArticleVotes = (article_id, votes = 0) => {
  return knex
    .increment({ votes })
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return rows;
    });
};

exports.fetchArticles = ({
  sort_by = "created_at",
  order = "desc",
  topic,
  author
}) => {
  return knex
    .select("articles.*")
    .count("comment_id as comment_count")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .modify(query => {
      if (topic) query.where({ topic });
      if (author) query.where({ "articles.author": author });
    })
    .groupBy("articles.article_id")
    .orderBy(sort_by, order);
};
