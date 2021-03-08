const express = require('express');
const router = express.Router();
const multer = require('../../utils/setup.multer');


const { getMyCourse, getSetting, postChangeAvatar } = require('../../controllers/clients/user.controller')

router.route('/myCourse').get(getMyCourse)
router.route('/setting').get(getSetting)
router.route("/:id/avatar/patch").post(multer.single("avatar"), postChangeAvatar)

module.exports = router;