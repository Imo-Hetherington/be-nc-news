process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("app", () => {
  beforeEach(() => {
    connection.seed.run();
  });

  after(() => connection.destroy());

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
