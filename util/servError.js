module.exports = function(res, err, errmsg) {
   console.log("This is login error: %s", err);
   switch (err) {
      case 0:
         return res.status(400).json({ message: "no such user found" });
      case 1:
         return res.status(401).json({ message: "passwords did not match" });
      case 3:
      	return res.status(403).json({ message: "a login session is required to use this function"});
      case 4:
      	return res.status(404).json({ message: "the page you are looking cannot be found"});
     	case 9:
     		return res.status(409).json({ message: "this email address has been taken" });
      case 10:
      	return res.status(410).send("requested link expired");
     	case 11000:
     		return res.status(409).json({ message: errmsg });
      default:
         return res.status(500).send(
            "Internval Server Error. Please note that our engineer is working hard to recover it."
         );
   }
}