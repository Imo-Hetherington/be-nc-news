const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
  getArticles
} = require("../controllers/articles-controller");
const {
  postCommentToArticle,
  getCommentsByArticle
} = require("../controllers/comments-controller");
const { handle405s } = require("../errors/index");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(handle405s);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentToArticle)
  .get(getCommentsByArticle)
  .all(handle405s);

module.exports = articlesRouter;
