const { expect } = require("chai");
const { formatDates } = require("../db/utils/utils");

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
