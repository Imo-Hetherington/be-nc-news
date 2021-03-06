const {
  addComment,
  fetchComments,
  updateCommentVotes,
  removeComment
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

exports.patchCommentVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  if (inc_votes && isNaN(Number(inc_votes)))
    next({ status: 400, msg: "Bad Request" });
  else {
    updateCommentVotes(comment_id, inc_votes)
      .then(([comment]) => {
        res.status(200).send({ comment });
      })
      .catch(err => next(err));
  }
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => next(err));
};
