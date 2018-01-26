const DEBUG = true;

const authRoute = require("express").Router();
const Auth = require("../lib/authcallback.js");
const ServErr = require("../util/servError.js");
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
               throw 204;
            }
            data = user;
            return hash.compare(password, user);
         })
         .then(isMatched => {
            if (!isMatched) {
               throw 1;
            }
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            console.log(refId);
            return res.status(202).json({ message: "ok", token: req.session.token });
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
         	console.log("this is wierd", data);
            return signToken(req, data, expiredIn)
         })
         .then(refId => {
            mail({ user, token: refId }, 0);
            return res.status(201).json({ message: "ok", token: req.session.token });
         })
         .catch(err => {
				if (err.code) {
					return ServErr(res, 11000, err.errmsg);
				} 
				ServErr(res, err);
         });
   });

   authRoute.post("/logout", Auth, function(req, res) {
		const { locals } = res;

      if (locals.error) {
         const { code, message } = locals.error;
         return res.status(code).send(message);
      }

      const { user, session } = req;
		const { _id } = user;

		delete req.session.user;
		delete req.session[_id];
		res.status(200).send("/");
   });

   authRoute.get("/user", Auth, function(req, res) {
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