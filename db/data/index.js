const devData = require("./development-data/index");
const testData = require("./test-data/index");

const ENV = process.env.NODE_ENV || "development";

const data = {
  development: {
    articleData: devData.articleData,
    commentData: devData.commentData,
    topicData: devData.topicData,
    userData: devData.userData
  },
  test: {
    articleData: devData.articleData,
    commentData: devData.commentData,
    topicData: devData.topicData,
    userData: devData.userData
  }
};

module.exports = data[ENV];
