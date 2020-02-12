const {
  fetchArticle,
  updateArticleVotes
} = require("../models/articles-model");

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params.article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.patchArticleVotes = (req, res, next) => {
  updateArticleVotes(req.params.article_id, req.body.inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};
