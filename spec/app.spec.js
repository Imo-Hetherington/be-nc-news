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
  });
});
