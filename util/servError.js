module.exports = function(res, err, errmsg) {
   console.log("This error handler: %s", err);
   switch (err) {
      case 1:
         return res.status(401).json({ message: "passwords did not match" });
      case 3:
         return res.status(403).json({ message: "a login session is required to use this function" });
      case 4:
         return res.status(404).json({ message: "the page you are looking cannot be found" });
      case 9:
         return res.status(409).json({ message: "this email address has been taken" });
      case 10:
         return res.status(410).json({ message: "requested link expired" });
      case 204:
         return res.status(204).send(); // 204 will not send anything back
      case 304:
         return res.status(304).json({ message: `this ${errmsg} has already been use by the user` });
      case 11000:
         return res.status(409).json({ message: errmsg });
      default:
         return res.status(500).json({
            message: "Internval Server Error. Please note that our engineer is working hard to recover it."
         });
   }
}

console.log("ServerError: \x1b[32mloaded!\x1b[0m");