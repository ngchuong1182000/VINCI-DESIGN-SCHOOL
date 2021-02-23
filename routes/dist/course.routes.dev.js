"use strict";

var express = require("express");

var router = express.Router();

var sectionRoutes = require('./section.routes');

router.use("/course/:slug2", sectionRoutes);

var _require = require('../controllers/course.controller'),
    getAllCourse = _require.getAllCourse,
    createCourse = _require.createCourse,
    getCourse = _require.getCourse,
    updateCourse = _require.updateCourse,
    deleteCourse = _require.deleteCourse,
    getDetail = _require.getDetail;

var _require2 = require("../controllers/auth.controller"),
    requireSignin = _require2.requireSignin,
    adminMiddleware = _require2.adminMiddleware,
    checkUser = _require2.checkUser;

router.route("/course-online").get(checkUser, getAllCourse).post(requireSignin, adminMiddleware, createCourse);
router.route("/course/:slug").get(getCourse).patch(requireSignin, adminMiddleware, updateCourse)["delete"](requireSignin, adminMiddleware, deleteCourse);
router.route("/:slug/course-detail").get(checkUser, getDetail);
module.exports = router;