const { expect } = require("chai");
const { formatDates, makeRefObj } = require("../db/utils/utils");

describe("formatDates", () => {
  it("Given a single object in an array, will return an array", () => {
    const testArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(testArr)).to.be.an("array");
    expect(formatDates(testArr)[0]).to.be.an("object");
  });
  it("Will convert timestamp in a given object to a date", () => {
    const testArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(testArr)[0].created_at).to.eql(new Date(1542284514171));
  });
  it("Given an array of multiple objects, will convert all timestamps to dates", () => {
    const testArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    expect(formatDates(testArr)[1].created_at).to.eql(new Date(1511354163389));
  });
  it("Will not mutate or reference original array.", () => {
    const testArr = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(formatDates(testArr)).not.to.equal(testArr);
    expect(formatDates(testArr)[0]).not.to.equal(testArr[0]);
    formatDates(testArr);
    expect(testArr).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("Given an array, will return an object.", () => {
    const testArr = [];
    expect(makeRefObj(testArr)).to.be.an("object");
  });
  it("Given an array containing 1 article object, will return an object with the article title and article_id as a key- value pair.", () => {
    const testArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    expect(makeRefObj(testArr)["Living in the shadow of a great man"]).to.equal(
      1
    );
  });
  it("Given an array containing multiple article objects, will return an object with the titles and article_ids as a key- value pairs.", () => {
    const testArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 53,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      }
    ];
    expect(
      makeRefObj(testArr)["UNCOVERED: catspiracy to bring down democracy"]
    ).to.equal(53);
  });
  it("Will not mutate original array.", () => {
    const testArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    makeRefObj(testArr);
    expect(testArr).to.eql([
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
});
