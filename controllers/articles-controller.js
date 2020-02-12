const {
  fetchArticle,
  updateArticleVotes,
  addComment
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

exports.postComment = (req, res, next) => {
  addComment(req.body, req.params.id).then(([comment]) => {
    res.status(201).send({ comment });
  });
};
