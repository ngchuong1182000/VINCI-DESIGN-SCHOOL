"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var User = require("../models/user.model");

exports.connectAuthGoogle = function () {
  var url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL;
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: "".concat(url, "/auth/google/secrets"),
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, function _callee(token, tokenSecret, profile, done) {
    var data, userData, newUser, user;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = profile._json;
            userData = {
              photo: data.picture,
              username: data.name
            };
            _context.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              email: data.email
            }));

          case 4:
            user = _context.sent;

            if (user) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return regeneratorRuntime.awrap(User.create(_objectSpread({
              email: data.email
            }, userData), {
              runValidators: false
            }));

          case 8:
            newUser = _context.sent;
            _context.next = 16;
            break;

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(User.findOneAndUpdate({
              email: data.email
            }, userData));

          case 13:
            _context.next = 15;
            return regeneratorRuntime.awrap(User.findOne({
              email: data.email
            }));

          case 15:
            newUser = _context.sent;

          case 16:
            return _context.abrupt("return", done(null, newUser));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    });
  }));
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (id, done) {
    done(null, id);
  });
};