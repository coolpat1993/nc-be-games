const {
  selectCategories,
  selectReviews,
  selectUsers,
  updateReview,
} = require("../models/models.js");

exports.testExample = (request, response) => {
  response.status(200).send({ msg: "this is a message" });
};

exports.viewCategories = (req, res) => {
  selectCategories().then(catas => {
    res.status(200).send({ categories: catas });
  });
};

exports.viewReviews = (req, res, next) => {
  const { review_id } = req.params;
  selectReviews(review_id)
    .then(review_by_id => {
      res.status(200).send({ review: review_by_id });
    })
    .catch(err => {
      next(err);
    });
};

exports.viewUsers = (req, res) => {
  selectUsers()
    .then(user => {
      res.status(200).send({ users: user });
    })
    .catch(err => {
      next(err);
    });
};

exports.patchReview = (req, res) => {
  const { review_id } = req.params;
  const updates = req.body.inc_votes;
  updateReview(review_id, updates).then(review => {
    console.log(review);
    res.status(201).send({ review });
  });
};
