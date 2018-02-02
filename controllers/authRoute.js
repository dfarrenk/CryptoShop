"use strict";
const DEBUG = true;

const authRoute = require("express").Router();
const Auth = require("../lib/authcallback.js")();
const ServErr = require("../util/servError.js");
const CRUD = require("../lib/CRUD.js");
const hash = require("../lib/encryptor.js");
const signToken = require("../lib/signToken.js");
const mail = require("../lib/sendgrid.js");
const _ = require("lodash");

const { "token-timeout": expiredIn } = require("../config/config.json");
require("../util/errorHandler")();

module.exports = function() {

   authRoute.post("/login", function(req, res) {
      DEBUG && console.log(req.body);
      DEBUG && console.log(req.headers);

      const { username, password, email } = req.body;
      const searchField = email ? { email } : { username };
      let user = undefined;

      CRUD
         .read(searchField)
         .then(data => {
            if (!data) {
               throw 204;
            }
            user = data;
            return hash.compare(password, data);
         })
         .then(isMatched => {
            if (!isMatched) {
               throw 1;
            }
            return signToken(req, user, expiredIn);
         })
         .then(refId => {
            DEBUG && console.log(refId);
            return res.status(202).json({ refId, redirect: "/search" });
         })
         .catch(err => {
            ServErr(res, err);
         });
   });

   authRoute.post("/register", function(req, res) {
      DEBUG && console.log(req.body);
      const { username, password, email } = req.body;
      let user = undefined;

      hash
         .create(password, username)
         .then(({ salt, hash, publickey }) => {
            return CRUD.create({ username, email, salt, publickey, password: hash });
         })
         .then(data => {
            user = data;
            return signToken(req, data, expiredIn)
         })
         .then(refId => {
            mail({ hostname: req.headers.origin, user, token: refId }, 0);
            return res.status(201).json({ refId, redirect: "/search" });
         })
         .catch(err => {
            if (err.code) {
               return ServErr(res, 11000, err.errmsg);
            }
            ServErr(res, err);
         });
   });

   authRoute.post("/logout", Auth, function(req, res) {
      const { user, session } = req;
      const { _id } = user;

      req.session.authenticated = false;
      delete req.session.user;
      delete req.session[_id];
      res.status(200).json({ message: "successfully signed out" });
   });

   return authRoute;
};

console.log("UserAuth controller: \x1b[32mloaded!\x1b[0m");