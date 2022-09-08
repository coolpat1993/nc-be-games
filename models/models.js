const db = require("../../be-nc-games/db/connection.js");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then(result => {
    return result.rows;
  });
};

exports.selectReviews = review_id => {
  if (isNaN(review_id) === true) {
    return Promise.reject({ status: 400, msg: "invalid review ID" });
  } else {
    return db
      .query(
        `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
        [review_id]
      )
      .then(result => {
        if (result.rows.length >= 1) {
          return result.rows[0];
        } else {
          return Promise.reject({
            status: 404,
            msg: "This review was not found",
          });
        }
      });
  }
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(result => {
    return result.rows;
  });
};

exports.updateReview = (review_id, updates) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;",
      [updates, review_id]
    )
    .then(result => {
      if (result.rows.length >= 1) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 400,
          msg: "This data is unreachable at this time",
        });
      }
    });
};

exports.selectAllReviews = (
  category,
  sort_by = "created_at",
  order_by = "DESC"
) => {
  const validSortColumns = ["created_at", "review_id", "title"];
  const validOrder = ["ASC", "DESC"];

  let queryStr = `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id`;

  queryValues = [];
  if (category) {
    queryStr += ` WHERE category = $1 GROUP BY reviews.review_id`;
    queryValues.push(category);
  } else {
    queryStr += ` GROUP BY reviews.review_id`;
  }

  if (!validSortColumns.includes(sort_by) || !validOrder.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  queryStr += ` ORDER BY ${sort_by} ${order_by};`;
  return db.query(queryStr, queryValues).then(result => {
    if (result.rows.length >= 1) {
      return result.rows;
    } else {
      return Promise.reject({
        status: 404,
        msg: "There were no reviews with those parameters",
      });
    }
  });
};
