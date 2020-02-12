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

exports.updateArticleVotes = (article_id, inc_votes) => {
  return knex
    .increment("votes", inc_votes)
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return rows;
    });
};

exports.addComment = ({ username, body }, article_id) => {
  const newComment = {
    author: username,
    body,
    article_id
  };
  return knex("comments")
    .insert(newComment)
    .returning("*")
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return rows;
    });
};

exports.fetchComments = article_id => {
  return knex
    .select("*")
    .from("comments")
    .where({ article_id })
    .then(rows => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      else return rows;
    });
};
