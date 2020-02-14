const {
  fetchArticle,
  fetchArticles,
  updateArticleVotes
} = require("../models/articles-model");
const { checkTopicExists } = require("../models/topics-model");
const { checkUserExists } = require("../models/users-model");

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
  if (inc_votes && isNaN(Number(inc_votes)))
    next({ status: 400, msg: "Bad Request" });
  else {
    updateArticleVotes(article_id, inc_votes)
      .then(([article]) => {
        res.status(200).send({ article });
      })
      .catch(err => next(err));
  }
};

exports.getArticles = (req, res, next) => {
  const { topic, author } = req.query;
  Promise.all([
    fetchArticles(req.query),
    checkTopicExists(topic),
    checkUserExists(author)
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(err => next(err));
};
