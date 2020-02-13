const knex = require("../db/connection");

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

exports.fetchComments = (
  article_id,
  { sort_by = "created_at", order = "desc" }
) => {
  return knex
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order);
};

exports.updateCommentVotes = (comment_id, { inc_votes }) => {
  return knex("comments")
    .increment("votes", inc_votes)
    .where({ comment_id })
    .returning("*");
};
