
const Session = require('../models/session.model')
const shortId = require('shortid');

module.exports = async (req, res, next) => {
  const id = shortId.generate();
  if (!req.signedCookies.cookies) {
    res.cookie("cookies", id, {
      signed: true
    });
    await Session.create({ _id: id });
  }
  next();
}