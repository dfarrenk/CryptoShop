const DEBUG = true;
const Passport = require("../config/jwt.js");

module.exports = function(req, res, next) {
   Passport.authenticate("jwt", (err, user, info) => {
      DEBUG && console.log("///////////////////////////////// this is auth");

      if (err) { 
      	console.log(err);
      	return next(err); 
      }

      if (!user) {
         const error = info.code ? info : { code: 403, message: info.message };
      	console.log(info);

         res.locals.error = error;
         return res.status(error.code).send(error.message);
      }

      req.user = user;
		console.log("success..ready to handle");
		console.log(req.user);
      next();
   })(req, res, next);
};