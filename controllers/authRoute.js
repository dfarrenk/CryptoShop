const DEBUG = true;

const authRoute = require("express").Router();
const Auth = require("../lib/authcallback.js");
const CRUD = require("../lib/CRUD.js");
const hash = require("../lib/encryptor.js");
const signToken = require("../lib/signToken.js");
const mail = require("../lib/sendgrid.js");
const _ = require("lodash");

const { "token-timeout": expiredIn } = require("../config/config.json");

module.exports = function() {

   authRoute.post("/login", function(req, res) {
      DEBUG && console.log(req.body);
      const { username, password, email } = req.body;
      const searchField = email ? { email } : { username };
      let data = undefined;

      CRUD
         .read(searchField)
         .then(user => {
            if (!user) {
               return res.status(204).json({ message: "no such user found" });
            }
            data = user;
            return hash.compare(password, user);
         })
         .then(isMatched => {
            if (!isMatched) {
               return res.status(401).json({ message: "passwords did not match" });
            }
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            res.status(202).json({ message: "ok", token: req.session.token });
         })
         .catch(err => {
            console.log("This is login error: %s", err);
            res.status(500).send(
               "Internval Server Error. Please note that our engineer is working hard to recover it."
            );
         });
   });

   authRoute.post("/register", function(req, res) {
      DEBUG && console.log(req.body);
      const { username, password, email } = req.body;

      hash
         .create(password, username)
         .then(({ salt, hash, publickey }) => {
            return CRUD.create({ username, email, salt, publickey, password: hash });
         })
         .then(user => {
            return signToken(req, user, expiredIn)
         })
         .then(refId => {
            mail({ user, token: refId }, 0);
            res.status(201).json({ message: "ok", token: req.session.token });
         })
         .catch(err => {
            console.log("This is register error: %s", err);
            const error = err.code === 11000 ? Object.assign({}, { message: err.errmsg }) : err;

            res.status(409).json(error);
         });
   });

   authRoute.get("/user", Auth);

   authRoute.get("/user", function(req, res) {
      DEBUG && console.log("======================================");
      DEBUG && console.log(req.session);
      DEBUG && console.log(req.hostname);
      DEBUG && console.log(req.ips);

      const { locals } = res;

      if (locals.error) {
         const { code, message } = locals.error;
         return res.status(code).send(message);
      }

      const { user, session } = req;
      const userInfo = session[user._id];
      res.status(200).json(userInfo);
   });

   return authRoute;
};
