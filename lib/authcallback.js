const DEBUG = true;
const Passport = require("../config/jwt.js");

module.exports = function(req, res, next) {
   Passport.authenticate("jwt", (err, user, info) => {
      DEBUG && console.log("///////////////////////////////// this is auth");
      
      if (err) { return next(err); }
      if (!user) {
			const error = info.code ? info : { code: 403, message: info.message };
         res.locals.error = error;
         next();
      }

      req.user = user;
      next();
   })(req, res, next);
};