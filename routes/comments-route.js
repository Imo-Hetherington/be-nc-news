const commentsRouter = require("express").Router();
const {
  patchCommentVotes,
  deleteComment
} = require("../controllers/comments-controller");
const { handle405s } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentVotes)
  .delete(deleteComment);

module.exports = commentsRouter;
