process.env.NODE_ENV = "test";
const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("app", () => {
  beforeEach(() => {
    return connection.seed.run();
  });

  after(() => connection.destroy());

  it("Non-existent endpoint - status: 404 and error message of 'path not found'", () => {
    return request(app)
      .get("/api/nothing-here")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Path Not Found");
      });
  });
  describe("api", () => {
    describe("topics", () => {
      describe("GET", () => {
        it("Success - status: 200 and sends back an array of topic objects", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an("array");
              expect(body.topics[0]).to.have.keys("slug", "description");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("Unhandled method - status: 405 and returns 'Invalid Method' error message", () => {
          const methods = ["post", "delete", "patch", "put"];
          const methodTests = methods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Invalid Method");
              });
          });

          return Promise.all(methodTests);
        });
      });
    });
    describe("/users", () => {
      describe("/:username", () => {
        describe("GET", () => {
          it("Success - status: 200 and sends back a single user object", () => {
            return request(app)
              .get("/api/users/lurker")
              .expect(200)
              .then(({ body }) => {
                expect(body.user).to.have.keys(
                  "username",
                  "name",
                  "avatar_url"
                );
              });
          });
          it("Non-existent username - status:404 returns 'user not found' error ", () => {
            return request(app)
              .get("/api/users/imabot")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("User not found");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("Unhandled method - status: 405 and returns 'Invalid Method' error message", () => {
            const methods = ["post", "delete", "patch", "put"];
            const methodTests = methods.map(method => {
              return request(app)
                [method]("/api/users/6")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Invalid Method");
                });
            });

            return Promise.all(methodTests);
          });
        });
      });
    });
    describe("/articles", () => {
      describe("/:article_id", () => {
        describe("GET", () => {
          it("Success - status: 200 returns object with default article keys", () => {
            return request(app)
              .get("/api/articles/2")
              .expect(200)
              .then(({ body }) => {
                expect(body.article).to.contain.keys(
                  "article_id",
                  "title",
                  "author",
                  "body",
                  "topic",
                  "created_at",
                  "votes"
                );
              });
          });
          it("Success - status: 200 and returns object with number of comments on that article on comment_count key", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body }) => {
                expect(body.article.comment_count).to.equal("13");
              });
          });
          it("Non-existent article_id - status: 404 and returns 'article not found' message", () => {
            return request(app)
              .get("/api/articles/2000")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article Not Found");
              });
          });
          it("Invalid article_id - status: 400 and returns 'bad request' message", () => {
            return request(app)
              .get("/api/articles/top")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("PATCH", () => {
          it("Success - status 200 and returns article object with incremented votes", () => {
            const votes = { inc_votes: 3 };
            return request(app)
              .patch("/api/articles/3")
              .send(votes)
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(3);
              });
          });
          it("Success & inc_votes is negative - status 200 and returns article object with decremented votes", () => {
            const votes = { inc_votes: -10 };
            return request(app)
              .patch("/api/articles/1")
              .send(votes)
              .expect(200)
              .then(({ body }) => {
                expect(body.article.votes).to.equal(90);
              });
          });
          it("Non-existent article_id - status: 404 and returns 'article not found' message", () => {
            const votes = { inc_votes: 3 };
            return request(app)
              .patch("/api/articles/2000")
              .send(votes)
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Article Not Found");
              });
          });
          it("Invalid article_id - status: 400 and returns 'bad request' message", () => {
            const votes = { inc_votes: 3 };
            return request(app)
              .patch("/api/articles/top")
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("Invalid inc_votes value - status: 400 and returns 'bad request' message", () => {
            const votes = { inc_votes: "4 million" };
            return request(app)
              .patch("/api/articles/3")
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("Empty request body - status: 400 and returns 'bad request' message", () => {
            const votes = {};
            return request(app)
              .patch("/api/articles/3")
              .send(votes)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("Unhandled method - status: 405 and returns 'Invalid Method' error message", () => {
            const methods = ["post", "delete", "put"];
            const methodTests = methods.map(method => {
              return request(app)
                [method]("/api/articles/2")
                .expect(405)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Invalid Method");
                });
            });

            return Promise.all(methodTests);
          });
        });
        describe("/comments", () => {
          describe("POST", () => {
            it("Success - status 201 and returns the posted comment", () => {
              const comment = {
                username: "rogersop",
                body: "Classic content, I love to see it!"
              };
              return request(app)
                .post("/api/articles/10/comments")
                .send(comment)
                .expect(201)
                .then(({ body }) => {
                  expect(body.comment).to.be.an("object");
                  expect(body.comment).to.have.keys(
                    "comment_id",
                    "body",
                    "author",
                    "votes",
                    "article_id",
                    "created_at"
                  );
                });
            });
            it("Non-existent article_id - status: 422 and returns 'unprocessable entity' message", () => {
              const comment = {
                username: "rogersop",
                body: "Classic content, I love to see it!"
              };
              return request(app)
                .post("/api/articles/2000/comments")
                .send(comment)
                .expect(422)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Unprocessable Entity");
                });
            });
            it("Invalid article_id - status: 400 and returns 'bad request' message", () => {
              const comment = {
                username: "rogersop",
                body: "Classic content, I love to see it!"
              };
              return request(app)
                .post("/api/articles/top/comments")
                .send(comment)
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
          });
          describe("GET", () => {
            it("Success - status: 200 and returns all comments for a specific article id", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.an("array");
                  expect(comments).to.have.length(13);
                  expect(comments[2]).to.have.keys(
                    "comment_id",
                    "body",
                    "votes",
                    "article_id",
                    "author",
                    "created_at"
                  );
                });
            });
            it("Success - returns empty array when an existing article has no comments", () => {
              return request(app)
                .get("/api/articles/4/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.eql([]);
                });
            });
            it("Default sort_by is created_at ascending", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("created_at");
                });
            });
            it("sort_by query can be passed", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=author")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("author");
                });
            });
            it("order query can be passed ", () => {
              return request(app)
                .get("/api/articles/1/comments?order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.ascendingBy("created_at");
                });
            });
            it("Non-existent article_id - status: 404 and returns 'Article Not Found' message", () => {
              return request(app)
                .get("/api/articles/2000/comments")
                .expect(404)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Article Not Found");
                });
            });
            it("Invalid article_id - status: 400 and returns 'bad request' message", () => {
              return request(app)
                .get("/api/articles/top/comments")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
            it("sort_by column non-existent - returns 400 bad request error", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=jokes_count")
                .expect(400)
                .then(({ body }) => {
                  expect(body.msg).to.equal("Bad Request");
                });
            });
          });
          describe("INVALID METHODS", () => {
            it("Unhandled method - status: 405 and returns 'Invalid Method' error message", () => {
              const methods = ["patch", "delete", "put"];
              const methodTests = methods.map(method => {
                return request(app)
                  [method]("/api/articles/2/comments")
                  .expect(405)
                  .then(({ body }) => {
                    expect(body.msg).to.equal("Invalid Method");
                  });
              });

              return Promise.all(methodTests);
            });
          });
        });
      });
      describe("GET", () => {
        it("Success - status: 200 and returns list of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");
              expect(body.articles).to.have.length(12);
            });
        });
        it("Default sort is by created_at descending", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("Article objects have default articles keys and comment_count key", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[4]).to.have.keys(
                "article_id",
                "author",
                "title",
                "body",
                "votes",
                "created_at",
                "topic",
                "comment_count"
              );
            });
        });
        it("Can pass a sort_by query to change order by column", () => {
          return request(app)
            .get("/api/articles?sort_by=author")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("author");
            });
        });
        it("Can pass an order query to change order to ascending", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("created_at");
            });
        });
        it("Can pass a topic query to filter results by topic", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.length(11);
            });
        });
        it("When passed a topic with no articles in the query, will return an empty array", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.eql([]);
            });
        });
        it("Can pass an author query to filter results by author", () => {
          return request(app)
            .get("/api/articles?author=butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.length(3);
            });
        });
        it("When passed an author with no articles in the query, will return an empty array", () => {
          return request(app)
            .get("/api/articles?author=lurker")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.eql([]);
            });
        });
        it("When passed an invalid/ non-existent sort_by query, will return 400 bad request error", () => {
          return request(app)
            .get("/api/articles?sort_by=lemons")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad Request");
            });
        });
        it("When passed an non-existent topic query, will return 404 Not Found error", () => {
          return request(app)
            .get("/api/articles?topic=4")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Topic Not Found");
            });
        });
        it("When passed an non-existent author query, will return 404 Not Found error", () => {
          return request(app)
            .get("/api/articles?author=me")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Author Not Found");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("Unhandled method - status: 405 and returns 'Invalid Method' error message", () => {
          const methods = ["post", "delete", "patch", "put"];
          const methodTests = methods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal("Invalid Method");
              });
          });

          return Promise.all(methodTests);
        });
      });
    });
    describe("/comments", () => {
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("Success - status: 200 and returns comment object with votes incremented", () => {
            return request(app)
              .patch("/api/comments/5")
              .send({ inc_votes: 3 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment).to.be.an("object");
                expect(comment).to.have.keys(
                  "comment_id",
                  "body",
                  "votes",
                  "article_id",
                  "author",
                  "created_at"
                );
                expect(comment.votes).to.equal(3);
              });
          });
          it("Success with inc_votes negative - status: 200 and returns comment object with votes incremented", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: -6 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(10);
              });
          });
          it("Valid but non-existent comment id - status: 404 and returns 'Comment Not Found' error", () => {
            return request(app)
              .patch("/api/comments/9000")
              .send({ inc_votes: 6 })
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Comment Not Found");
              });
          });
          it("Invalid comment id - status: 400 and returns 'Bad Request' error", () => {
            return request(app)
              .patch("/api/comments/plum")
              .send({ inc_votes: 6 })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
          it("Invalid inc_votes value - status: 400 and returns 'Bad Request' error", () => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: "7 thousand" })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
        describe.only("DELETE", () => {
          it("Success - returns 204 and no content and removes comment from the db", () => {
            return request(app)
              .delete("/api/comments/2")
              .expect(204)
              .then(() => {
                return request(app)
                  .patch("/api/comments/2")
                  .send({ inc_votes: 6 })
                  .expect(404);
              });
          });
          it("Valid but non-existent comment id - status: 404 and returns 'Comment Not Found' error", () => {
            return request(app)
              .delete("/api/comments/9000")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal("Comment Not Found");
              });
          });
          it("Invalid comment id - status: 400 and returns 'Bad Request' error", () => {
            return request(app)
              .delete("/api/comments/plum")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal("Bad Request");
              });
          });
        });
      });
    });
  });
});
