const knex = require("../db/connection");

exports.selectTopics = () => {
  return knex.select("*").from("topics");
};

exports.checkTopicExists = slug => {
  return knex
    .select("*")
    .from("topics")
    .modify(query => {
      if (slug) query.where({ slug });
    })
    .then(rows => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic Not Found" });
      }
    });
};
