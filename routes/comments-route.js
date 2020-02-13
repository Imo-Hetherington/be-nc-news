const commentsRouter = require("express").Router();
const { patchCommentVotes } = require("../controllers/comments-controller");
const { handle405s } = require("../errors/index");

commentsRouter.route("/:comment_id").patch(patchCommentVotes);

module.exports = commentsRouter;
