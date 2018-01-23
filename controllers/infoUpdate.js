const infoRoute = require("express").Router();
const Passport = require("../config/jwt.js");
const CRUD = require("../lib/CRUD");
const signToken = require("../lib/signToken");
const _ = require("lodash");
const { authUser: memoryStore } = require("../config/config");

module.exports = function() {
   // infoRoute.all("/user/*", Passport.authenticate("jwt", { session: false }));

   infoRoute.post("/user/forgotPass", function(req, res) {
      // send email
   });

   infoRoute.get("/user/verification", function(req, res, next) {
      console.log("this is verification");
      console.log(req.query["t"]);
      const refId = req.query["t"];
      const user = memoryStore[refId];

      if (user) {
         return CRUD
            .update(user._id, { emailverified: true })
            .then(data => {
               console.log("this is data ", data);
               return signToken(req, data, 5 * 60);
            })
            .then(refId => {
            	console.log(req.session[memoryStore[refId]._id]);
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
            console.log("here");
            isInSessHistory = memoryStore[key];
         }
      });

      console.log("yayayayay");

      if (isInSessHistory) {
         return CRUD.update(isInSessHistory._id, { emailverified: true }).then(data => {
            console.log("this is data ", data);
            res.status(200).send("awesome");
         });
      }

      res.status(401).send("requested link expired");
   });

   // two ways to trigger email
   // auth - register
   // before checkout
   // but if user session auth changed
   // now memorystore stores past session auth ref
   // so if the user token doesn't match --- look for past
   // session ref

   return infoRoute;
};