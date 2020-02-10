const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

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

describe("formatComments", () => {
  it("Given an array, will return a new array.", () => {
    const testArr = [];
    expect(formatComments(testArr)).to.eql([]);
    expect(formatComments(testArr)).not.to.equal(testArr);
  });
  it("Given an array of 1 comment object, will return an array containing that object with title changed to id.", () => {
    const testArr = [
      {
        comment_id: 12,
        body: "I love this content!",
        title: "In defense of Jest"
      }
    ];
    const refObj = { "In defense of Jest": 4 };
    expect(formatComments(testArr, refObj)).to.eql([
      {
        comment_id: 12,
        body: "I love this content!",
        article_id: 4
      }
    ]);
  });
  it("Given an array of multiple comment objects, will return an array containing that object with title changed to id.", () => {
    const testArr = [
      {
        comment_id: 12,
        body: "I love this content!",
        title: "In defense of Jest"
      },
      {
        comment_id: 5,
        body: "jest sux",
        title: "In defense of Jest"
      },
      {
        comment_id: 7,
        body: "Thanks for these great recs!",
        title: "The 10 Best Board Games of The Decade"
      }
    ];
    const refObj = {
      "In defense of Jest": 4,
      "The 10 Best Board Games of The Decade": 19
    };
    expect(formatComments(testArr, refObj)).to.eql([
      {
        comment_id: 12,
        body: "I love this content!",
        article_id: 4
      },
      {
        comment_id: 5,
        body: "jest sux",
        article_id: 4
      },
      {
        comment_id: 7,
        body: "Thanks for these great recs!",
        article_id: 19
      }
    ]);
  });
  it("Doesn't mutate original array", () => {
    const testArr = [
      {
        comment_id: 12,
        body: "I love this content!",
        title: "In defense of Jest"
      }
    ];
    const refObj = { "In defense of Jest": 4 };
    formatComments(testArr, refObj);
    expect(testArr).to.eql([
      {
        comment_id: 12,
        body: "I love this content!",
        title: "In defense of Jest"
      }
    ]);
    expect(testArr[0]).to.eql({
      comment_id: 12,
      body: "I love this content!",
      title: "In defense of Jest"
    });
  });
});
