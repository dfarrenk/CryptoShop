"use strict";

const Jwt = require("jsonwebtoken");
const db = require("../models");
const Uid = require("uid-safe").sync;
const _ = require("lodash");
const { jwt_config: config, memoryStore } = require("../config/config.js");

module.exports = function(req, user, timeout) {
   return new Promise((resolve, reject) => {
      const {
         _id,
         username,
         firstname,
         lastname,
         address,
         email,
         emailverified,
         orders,
         txid
      } = user;
      const refId = Uid(24);
      const payload = { $id: refId };
      const key = user.publickey;
      const privToken = Jwt.sign(payload, config.secretOrKey);
      const token = Jwt.sign({
            token: privToken
         },
         key, { expiresIn: timeout }
      );

      req.session.regenerate(function(err) {
			if (err) {
				console.log(err);
				throw err;
			}

         req.session.authenticated = true;
         req.session.user = { key, token };
         req.session[_id] = {
            username,
            firstname,
            lastname,
            address,
            email,
            emailverified,
            orders,
            txid
         };

         const isExisted = _.findKey(memoryStore, function(elem) {
            return elem.username === username;
         });
         const history = isExisted && memoryStore[isExisted].isActive
         	? Object.assign({ [refId]: true }, memoryStore[isExisted].history) 
            : { [refId]: true };

         if (isExisted) {
            delete memoryStore[isExisted];
         }

         memoryStore.setUserSession = { refId, username, _id, history };
         resolve(refId);
      });
   });
};

process.on("unhandledRejection", (reason, p) => {
   console.log("Unhandled Rejection at:", p, "reason:", reason);
});