"use strict";

var Section = require("../models/section.model");

var factory = require("./handleFactory");

var Course = require("../models/course.model");

module.exports.getAll = factory.getAll(Section, Course);
module.exports.createOne = factory.createOne(Section);
module.exports.getOne = factory.getOne(Section, Course);
module.exports.updateOne = factory.updateOne(Section);
module.exports.deleteOne = factory.deleteOne(Section);