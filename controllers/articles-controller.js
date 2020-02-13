const {
  fetchArticle,
  fetchArticles,
  updateArticleVotes
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

exports.getArticles = (req, res, next) => {
  fetchArticles().then(articles => {
    res.status(200).send({ articles });
  });
};
