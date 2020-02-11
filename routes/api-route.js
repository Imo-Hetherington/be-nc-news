const apiRouter = require("express").Router();
const topicsRouter = require("./topics-route");
const usersRouter = require("./users-route");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
