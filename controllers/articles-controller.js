const {
  fetchArticle,
  updateArticleVotes,
  addComment,
  fetchComments
} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticle(id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;
  if (isNaN(Number(votes))) next({ status: 400, msg: "Bad Request" });
  else {
    updateArticleVotes(id, votes)
      .then(([article]) => {
        res.status(200).send({ article });
      })
      .catch(err => next(err));
  }
};

exports.postCommentToArticle = (req, res, next) => {
  addComment(req.body, req.params.article_id)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(err => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  fetchComments(req.params.article_id)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};
