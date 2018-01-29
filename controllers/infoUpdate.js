"use strict";
const DEBUG = true;

const Join = require("path").join;
const infoRoute = require("express").Router();
const _ = require("lodash");

const Auth = require("../lib/authcallback.js");
const ServErr = require("../util/servError.js");
const signToken = require("../lib/signToken.js");
const CRUD = require("../lib/CRUD.js");

const { "token-timeout": expiredIn } = require("../config/config.json");

module.exports = function() {

   infoRoute.put("/api/user", Auth, function(req, res) {
      DEBUG && console.log(req.body); // client handles invalid input
      const { _id: uid } = req.user;

      CRUD
      .update(uid, req.body)
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

   //route for access user's purchases
   infoRoute.get("/api/myOrders", Auth, function(req, res) {
      DEBUG && console.log("\x1b[32mDEBUG: \x1b[0m/api/myOrders");
      const { _id: uid } = req.user;
		
		// this way we don't have to query database
		// const { orders } = req.session[uid];
		// res.status(200).send(orders);

      CRUD.read({
         _id: uid
      }).then(info=>{
         res.status(200).send(info.orders);
      });
   });

   return infoRoute;
}