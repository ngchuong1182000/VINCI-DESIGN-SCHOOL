const Section = require("../models/section.model");
const factory = require("./handleFactory");
const Course = require("../models/course.model");

module.exports.getAll = factory.getAll(Section, Course);

module.exports.createOne = factory.createOne(Section);

module.exports.getOne = factory.getOne(Section, Course);

module.exports.updateOne = factory.updateOne(Section);

module.exports.deleteOne = factory.deleteOne(Section);