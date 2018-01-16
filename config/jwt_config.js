const PassportJwt = require("passport-jwt");
const ExtractJwt = PassportJwt.ExtractJwt;

function ExtractFromCookie(req) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies["jwt-token"];	
	}
	return token;
}

module.exports = {
	secretOrKey: "some secret",
	jwtFromRequest: ExtractFromCookie,
	algorithms: "HS256"
}