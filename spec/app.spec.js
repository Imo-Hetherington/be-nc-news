process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
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
    describe.only("/articles", () => {
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
      });
    });
  });
});
