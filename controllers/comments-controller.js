const {
  addComment,
  fetchComments,
  updateCommentVotes
} = require("../models/comments-model");
const { fetchArticle } = require("../models/articles-model");

exports.postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  addComment(req.body, article_id)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id, req.query), fetchArticle(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};
exports.postCommentToArticle = (req, res, next) => {
  const { article_id } = req.params;
  addComment(req.body, article_id)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id, req.query), fetchArticle(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  updateCommentVotes(comment_id, req.body).then(([comment]) => {
    res.status(200).send({ comment });
  });
};
