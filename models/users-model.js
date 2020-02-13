const knex = require("../db/connection");

exports.fetchUser = username => {
  return knex
    .select("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      } else return user;
    });
};

exports.checkUserExists = username => {
  return knex
    .select("*")
    .from("users")
    .modify(query => {
      if (username) query.where("username", username);
    })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "Author Not Found" });
      }
    });
};
