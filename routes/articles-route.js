const articlesRouter = require("express").Router();
const { getArticle } = require("../controllers/articles-controller");
const { handle405s } = require("../errors/index");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .all(handle405s);

module.exports = articlesRouter;
