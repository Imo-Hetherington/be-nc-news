process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");

describe("app", () => {
  describe("api", () => {
    describe("topics", () => {
      describe("GET", () => {
        it("Success - status: 200", () => {
          return request(app)
            .get("/api/topics")
            .expect(200);
        });
      });
    });
  });
});
