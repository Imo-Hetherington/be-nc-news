const apiRouter = require("express").Router();
const topicsRouter = require("./topics-route");
const usersRouter = require("./users-route");
const articlesRouter = require("./articles-route");
const commentsRouter = require("./comments-route");
const { getEndpoints } = require("../controllers/endpoints-controller");
const { handle405s } = require("../errors/index");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter
  .route("/")
  .get(getEndpoints)
  .all(handle405s);

module.exports = apiRouter;
