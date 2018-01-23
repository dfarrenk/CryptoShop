const DEBUG = true;

const Passport = require("../config/jwt.js");
const authRoute = require("express").Router();
const CRUD = require("../lib/CRUD");
const hash = require("../lib/encryptor.js");
const signToken = require("../lib/signToken.js");
const mail = require("../lib/sendgrid.js");
const _ = require("lodash");

module.exports = function() {

   authRoute.post("/login", function(req, res) {
      DEBUG && console.log(req.body);
      const { username, password, email } = req.body;
      const searchField = email ? { email } : { username };

      CRUD
         .read(searchField)
         .then(user => {
            if (!user) {
               return res.status(401).json({ message: "no such user found" });
            }

            hash
               .compare(password, user)
               .then(isMatched => {
                  if (isMatched) {
                     signToken(req, user, 5 * 60).then(() => {
                        DEBUG && console.log("this is fresh air", req.sessionID);

                        res.status(200).json({ message: "ok", token: req.session.token });
                     }).catch(DEBUG && console.log.bind(console)); // sign token with private key && store in session
                  } else {
                     res.status(401).json({ message: "passwords did not match" });
                  }
               })
               .catch(err => {
                  DEBUG && console.log(err);
                  res
                     .status(500)
                     .send(
                        "Internval Server Error. Please note that our engineer is working hard to recover it."
                     );
               });
         });
   });

   authRoute.post("/register", function(req, res) {
      DEBUG && console.log(req.body);
      const { username, password, email } = req.body;

      hash
         .create(password, username)
         .then(({ salt, hash, publickey }) => {
            return CRUD.create({
               username,
               email,
               salt,
               publickey,
               password: hash
            });
         })
         .then(user => {
            // timeout should be passed from a config.json which stores lots of stuff
            signToken(req, user, 5 * 60).then(refId => {
               DEBUG && console.log("djfadjfla");
               DEBUG && console.log(req.sessionID);
               console.log(req.hostname);
               console.log(req.originalUrl);

               //////////////////////
               mail({ user, token: refId }, 0);
               /////////////////////

               res.status(200).json({ message: "ok", token: req.session.token });
            }).catch(DEBUG && console.log.bind(console));
         })
         .catch(err => {
            DEBUG && console.log("is this where the null is? %s", err);
            res.status(401).send(err); // process mongo related error
         });
   });

   authRoute.get("/user", Passport.authenticate("jwt", { session: false }), function(
      req,
      res
   ) {
      // not getting get request from react
      DEBUG && console.log("======================================");
      DEBUG && console.log(req.sessionID);
      DEBUG && console.log(req.user);
      
      const { user, session } = req;
      const userInfo = session[user._id];

      res.status(200).json(userInfo);
   });

   return authRoute;
};