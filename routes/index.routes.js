const express = require('express');
const router = express.Router();

const { getHomePage } = require('../controllers/index.controller')

router.get('/', getHomePage);
router.all("*", (req, res, next) => {
  res.render('err/Error404', { code: 404 });
});

module.exports = router;