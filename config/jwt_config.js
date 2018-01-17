const PassportJwt = require("passport-jwt");
const ExtractJwt = PassportJwt.ExtractJwt;

function ExtractFromCookie(req) {
	console.log(req.session);
	const {authenticated, cookie} = req.session;
	if (authenticated) {
		return req.session.token;
	}

	return null;
}

// function ExtractFromCookie(req) {
// 	let token = null;
// 	if (req && req.cookies) {
// 		token = req.cookies["jwt-token"];
// 	}
// 	return token;
// }

module.exports = {
	secretOrKey: "some secret",
	jwtFromRequest: ExtractFromCookie,
	algorithms: "HS256"
}