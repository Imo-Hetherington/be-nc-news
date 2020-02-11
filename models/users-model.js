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
