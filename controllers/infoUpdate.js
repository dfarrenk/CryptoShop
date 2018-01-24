const Join = require("path").join;
const Uid = require("uid-safe").sync;
const infoRoute = require("express").Router();
const _ = require("lodash");

const CRUD = require("../lib/CRUD");
const Passport = require("../config/jwt")
const signToken = require("../lib/signToken");
const hash = require("../lib/encryptor");
const mail = require("../lib/sendgrid");
const { memoryStore } = require("../config/config");

module.exports = function() {

   infoRoute.get("/user/verification", function(req, res, next) {
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
         return res.status(401).send("requested link expired");
      }

      CRUD
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
   });

   infoRoute.get("/user/changePass", function(req, res) {
      const refId = req.query["t"];
      
      if (!memoryStore.temp[refId]) {
         return res.status(401).send("link expired");
      }

      res.status(200).sendFile(Join(__dirname, "../cryptoshopreact/public/changepass.html"));
   });

   infoRoute.put("/user/resetPass", function(req, res) {
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
            mail({ user: { username, password, email } }, 2);
            ///////////////////////////////

            res.status(200).json({
               message: "awesome",
               newRef: refId
            });
         })
         .catch(console.log.bind(console));
   });

   infoRoute.post("/user/forgotPass", function(req, res) {
		console.log("I forgot my password");

      CRUD
         .read(req.body)
         .then(user => {
            if (user) {
               console.log("I forgot my password");
               const { _id, username } = user;
               const refId = Uid(24);

               memoryStore.setTemp = [{ _id, username }, refId];
               mail({ user, token: refId }, 1);

               res.status(200).send("success");
            } else {
               res.status(401).send("can't find the user");
            }
         })
         .catch(console.log.bind(console));
   });

  
   //////////////////////
   // privilege routes //
   /////////////////////

   infoRoute.put("/user/*", Passport.authenticate("jwt", { session: false}));

   infoRoute.put("/user/changeEmail", function(req, res) {
		const { email } = req.body;
		const { username: curuser } = req.session[req.user._id];

		CRUD
			.read({ email })
			.then(user => {
				if (user.username !== curuser) {
					return res.status(403).send("this email address has been taken");
				}
				return CRUD.update(user._id, { email, emailverified: false })
			})
			.then(data => {
				return signToken(req, data, 5 * 60);
			})
			.then(refId => {
				mail({ data, token: refId }, 0);
				res.status(200).json({ message: "ok", token: req.session.token });
			}).catch(console.log.bind(console));
   });

   infoRoute.put("/user/changePass", function(req, res) {
		const { password: original, newpassword: password } = req.body;
		const { _id } = req.session[req.user._id];

		CRUD
			.read({ _id })
			.then(user => {
				return hash.compare(original, user)
			})
			.then(isMatched => {
				if (!isMatched) {
					return res.status(403).send("the password you put in doesn't match the password in our database");
				}
				return hash.create(password, user.username);
			})
			.then(({ salt, hash, publickey }) => {
				return CRUD.update(_id, { salt, hash, publickey });
			})
			.then(data => {
				return signToken(req, data, 5 * 60);
			})
			.then(refId => {
				mail({ user: { username, password, email } }, 2);
				res.status(200).json({
               message: "awesome",
               newRef: refId
            });
			})
			.catch(console.log.bind(console));
   });

   return infoRoute;
};