"use strict";

var mongoose = require("mongoose");

function Connect() {
  return regeneratorRuntime.async(function Connect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mongoose.connect(process.env.DATABASE_LOCAL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
          }).then(function () {
            return console.log("DB is connected");
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  Connect: Connect
};