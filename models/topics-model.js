const knex = require("../db/connection");

exports.fetchTopics = ({ limit, p }) => {
  return knex
    .select("*")
    .from("topics")
    .modify(query => {
      if (limit) query.limit(limit);
      if (limit && p) query.offset((p - 1) * limit);
    });
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
