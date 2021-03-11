"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;

var User = require("../models/user.model");

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

exports.connectAuthFacebook = function () {
  var url = process.env.NODE_ENV === 'production' ? process.env.PRODUCT_URL : process.env.CLIENT_URL;
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "".concat(url, "/auth/facebook/secrets"),
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, function _callee(accessToken, refreshToken, profile, cb) {
    var data, password, userData, newUser, user, msg;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = profile._json;
            password = makeid(6);
            userData = {
              photo: data.picture.data.url,
              username: data.name,
              password: password
            };
            _context.next = 5;
            return regeneratorRuntime.awrap(User.findOne({
              email: data.email
            }));

          case 5:
            user = _context.sent;

            if (user) {
              _context.next = 14;
              break;
            }

            msg = {
              to: data.email,
              from: 'chunguyenchuong2014bg@gmail.com',
              // Use the email address or domain you verified above
              subject: "Welcome to VINCI DESIGN SCHOOL",
              html: "<div>C\u1EA3m \u01A1n b\u1EA1n \u0111\xE3 tin t\u01B0\u1EDFng v\xE0 s\u1EED d\u1EE5ng d\u1ECBch v\u1EE5 c\u1EE7a VINCI DESIGN SCHOOL, \n          M\u1EADt kh\u1EA9u c\u1EE7a b\u1EA1n l\xE0 : <span style=\"font-weight: 700;\"> ".concat(password, " </span> . \n          Vui l\xF2ng \u0111\u1ED5i m\u1EADt kh\u1EA9u b\u1EB1ng c\xE1ch truy c\u1EADp t\xE0i kho\u1EA3n tr\xEAn webside v\xE0 kh\xF4ng chia s\u1EBB v\u1EDBi b\u1EA5t k\u1EF3 ai.")
            };
            sgMail.send(msg).then(function () {}, function (error) {
              console.error(error);

              if (error.response) {
                console.error(error.response.body);
              }
            });
            _context.next = 11;
            return regeneratorRuntime.awrap(User.create(_objectSpread({
              email: data.email
            }, userData)));

          case 11:
            newUser = _context.sent;
            _context.next = 19;
            break;

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(User.findOneAndUpdate({
              email: data.email
            }, userData));

          case 16:
            _context.next = 18;
            return regeneratorRuntime.awrap(User.findOne({
              email: data.email
            }));

          case 18:
            newUser = _context.sent;

          case 19:
            return _context.abrupt("return", cb(null, newUser));

          case 20:
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