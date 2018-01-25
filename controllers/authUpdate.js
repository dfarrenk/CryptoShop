const Join = require("path").join;
const Uid = require("uid-safe").sync;
const authUpdate = require("express").Router();
const _ = require("lodash");

const CRUD = require("../lib/CRUD.js");
const Auth = require("../lib/authcallback.js");
const ServErr = require("../util/ServError.js");
const signToken = require("../lib/signToken.js");
const hash = require("../lib/encryptor.js");
const mail = require("../lib/sendgrid.js");
const { memoryStore } = require("../config/config.js");

const { "token-timeout": expiredIn } = require("../config/config.json");

module.exports = function() {

   authUpdate.get("/user/verification", function(req, res, next) {
      console.log("this is verification");
      const refId = req.query["t"];
      let isInSessHistory = false;

      _.forIn(memoryStore, function(val, key) {
         if (_.has(val.history, refId)) {
            isInSessHistory = memoryStore[key];
         }
      });

      const user = memoryStore[refId] || isInSessHistory;
      if (!user) {
         return ServErr(res, 10);
      }

      CRUD
         .update(user._id, { emailverified: true })
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });

   authUpdate.get("/user/changePass", function(req, res) {
      const refId = req.query["t"];
      if (!memoryStore.temp[refId]) {
         return ServErr(res, 10);
      }
      res.status(200).sendFile(Join(__dirname, "../cryptoshopreact/public/changepass.html"));
   });

   authUpdate.put("/user/resetPass", function(req, res) {
      console.log(memoryStore);

      const { username, password } = req.body;
      const refId = req.query["t"];
      const { _id: uid, username: _user } = memoryStore.temp[refId];

      if (username !== _user) {
         return ServErr(res, 0);
      }

      hash
         .create(password, username)
         .then(({ salt, hash, publickey }) => {
            return CRUD.update(uid, { salt, password: hash, publickey })
         })
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            const { username, email } = req.session[uid];

            mail({ user: { username, password, email } }, 2);
            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });

   authUpdate.post("/user/forgotPass", function(req, res) {
      CRUD
         .read(req.body)
         .then(user => {
            console.log("I forgot my password");

            if (!user) {
               throw 0;
            }
            const { _id, username } = user;
            const refId = Uid(24);
            memoryStore.setTemp = [{ _id, username }, refId];
            mail({ user, token: refId }, 1);

            res.status(200).json({ message: "success" });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });


   //////////////////////
   // privilege routes //
   /////////////////////

   authUpdate.put("/user/*", Auth);


   authUpdate.put("/user/changeEmail", function(req, res) {
      const { email } = req.body;
      const { username: curuser } = req.session[req.user._id];

      if (locals.error) {
         const { code, message } = locals.error;
         return res.status(code).json({ message });
      }

      CRUD
         .read({ email })
         .then(user => {
            if (user.username !== curuser) {
               throw 0;
            }
            return CRUD.update(user._id, { email, emailverified: false })
         })
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            mail({ data, token: refId }, 0);
            res.status(200).json({ message: "ok", token: req.session.token });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });

   authUpdate.put("/user/changePass", function(req, res) {
      const { password: original, newpassword: password } = req.body;
      const { _id } = req.session[req.user._id];

      if (locals.error) {
         const { code, message } = locals.error;
         return res.status(code).json({ message });
      }

      CRUD
         .read({ _id })
         .then(user => {
            return hash.compare(original, user)
         })
         .then(isMatched => {
            if (!isMatched) {
               throw 1;
            }
            return hash.create(password, user.username);
         })
         .then(({ salt, hash, publickey }) => {
            return CRUD.update(_id, { salt, hash, publickey });
         })
         .then(data => {
            return signToken(req, data, expiredIn);
         })
         .then(refId => {
            mail({ user: { username, password, email } }, 2);
            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(err => {
            return ServErr(res, err);
         });
   });

   return authUpdate;
};