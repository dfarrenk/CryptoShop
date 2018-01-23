const infoRoute = require("express").Router();
const Join = require("path").join;
const CRUD = require("../lib/CRUD");
const signToken = require("../lib/signToken");
const hash = require("../lib/encryptor.js");
const mail = require("../lib/sendgrid");
const Uid = require("uid-safe").sync;
const _ = require("lodash");
const { memoryStore } = require("../config/config");

module.exports = function() {

   infoRoute.get("/user/verification", function(req, res, next) {
      console.log("this is verification");
      const refId = req.query["t"];
      const user = memoryStore[refId];

      if (user) {
         return CRUD
            .update(user._id, { emailverified: true })
            .then(data => {
               return signToken(req, data, 5 * 60);
            })
            .then(refId => {
               res.status(200).json({
                  message: "awesome",
                  newRef: refId
               });
            })
            .catch(console.log.bind(console));
      }

      let isInSessHistory = false;

      _.forIn(memoryStore, function(val, key) {
         if (_.has(val.history, refId)) {
            isInSessHistory = memoryStore[key];
         }
      });

      if (isInSessHistory) {
         return CRUD
            .update(isInSessHistory._id, { emailverified: true })
            .then(data => {
               return signToken(req, data, 5 * 60);
            })
            .then(refId => {
               res.status(200).json({
                  message: "awesome",
                  newRef: refId
               });
            })
            .catch(console.log.bind(console));
      }

      res.status(401).send("requested link expired");
   });

   infoRoute.get("/user/changePass", function(req, res) {
      const refId = req.query["t"];
      console.log(refId);

      if (!memoryStore.temp[refId]) {
         return res.status(401).send("link expired");
      }

      res.status(200).sendFile(Join(__dirname, "../cryptoshopreact/public/changepass.html"));
   });

   infoRoute.post("/user/resetPass", function(req, res) {
      console.log(memoryStore);

      const { username, password } = req.body;
      const refId = req.query["t"];
      const { _id: uid, username: _user } = memoryStore.temp[refId];

      if (username !== _user) {
         return res.status(403).send("the username you put doens't match any user in our database");
      }

      hash
         .create(password, username)
         .then(({ salt, hash, publickey }) => {
            return CRUD.update(uid, { salt, password: hash, publickey })
         })
         .then(data => {
            return signToken(req, data, 5 * 60);
         })
         .then(refId => {
            const { username, email } = req.session[uid];

            ////////////////////////////////	
            mail({ user: { username, password, email }}, 2);
            ///////////////////////////////

            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(console.log.bind(console));
   });

   infoRoute.post("/user/forgotPass", function(req, res) {
      // send email with link to post "/user/changePass"
      const { username, email } = req.body;
      const searchFields = { username, email };
      CRUD
         .read(searchFields)
         .then(user => {
            if (user) {
               console.log("I forgot my password");
               const { _id, username } = user;

               //////////////////////// create a temp, with timeout --> need to work that later
               const refId = Uid(24);
               memoryStore.temp[refId] = { _id, username, status: "pending" };
               console.log(memoryStore);
               mail({ user, token: refId }, 1);
               /////////////////////// when user click the link query is going to 

               res.status(200).send("success");
            } else {
               res.status(401).send("can't find the user");
            }
         })
         .catch(console.log.bind(console));
   });

   return infoRoute;
};