const Session = require("../models/Session.model");

module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.headers.authorization || req.headers.authorization === "null") {
    return next();
  }

  Session.findById(req.headers.authorization)
    .populate({ path: "user", model: "User" })
    .then((session) => {
      if (!session) {
        return next();
      }
      // makes the user available in `req.user` from now onwards
      req.user = session.user;
      next();
    })
    .catch((err) => {
      return res.status(500).json({ errorMessage: err.message });
    });
};
