const DEBUG = false;
const Passport = require("../config/jwt.js");

module.exports = function(req, res, next) {
   Passport.authenticate("jwt", (err, user, info) => {
      DEBUG && console.log("///////////////////////////////// this is auth");

      if (err) { 
      	console.log(err);
      	return next(err); 
      }

      if (!user) {
         console.log(info);
         const error = info.code ? info : { code: 403, message: info.message };

         res.locals.error = error;
         return res.status(error.code).send(error);
      }

      req.user = user;
		DEBUG && console.log("success..ready to handle");
		DEBUG && console.log(req.user);
      next();
   })(req, res, next);
};
console.log("Auth: \x1b[32mloaded!\x1b[0m");
