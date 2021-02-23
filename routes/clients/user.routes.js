const express = require('express');
const router = express.Router();

const { getMyCourse } = require('../../controllers/clients/user.controller')

router.route('/myCourse').get(getMyCourse)

module.exports = router;