const Passport = require("passport");
const PassportJwt = require("passport-jwt");
const JwtStrategy = PassportJwt.Strategy;

const { jwt_config: config, memoryStore } = require("./config.js");
const Users = require("../models").User;

const strategy = new JwtStrategy(config, function(jwt_payload, next) {
   console.log("this is payload", jwt_payload);
   console.log(memoryStore);

   const user = memoryStore[jwt_payload.$id];
	
   if (!user) {
      return next(null, false, { code: 401, message: "unauthorized" });
   }

   return next(null, user);
});

Passport.use(strategy);

module.exports = Passport;