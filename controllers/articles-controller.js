const {
  fetchArticle,
  updateArticleVotes,
  addComment,
  fetchComments
} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (isNaN(Number(inc_votes))) next({ status: 400, msg: "Bad Request" });
  else {
    updateArticleVotes(article_id, inc_votes)
      .then(([article]) => {
        res.status(200).send({ article });
      })
      .catch(err => next(err));
  }
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
