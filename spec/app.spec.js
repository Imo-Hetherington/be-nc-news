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

  it("Non-existent enpoint - status: 404 and error message of 'path no found'", () => {
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
    });
  });
});
