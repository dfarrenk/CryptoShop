const PassportJwt = require("passport-jwt");
const ExtractJwt = PassportJwt.ExtractJwt;
const Jwt = require("jsonwebtoken");

function ExtractFromCookie(req) {
	const { authenticated, token, key } = req.session;

	if (authenticated) {
		try {
			const decoded = Jwt.verify(token, key); // decode with private key first
			return decoded.token;
		} catch(err) {
			console.log(err);
			return err;
		}
	}
	return null;
}

module.exports = function(dev) {
	const devMode = dev === "dev";

	const server_config = {
		port: process.env.PORT || 8080,
		authyAPIKey: process.env.AUTHY_API_KEY,
		mongoURL: process.env.MONGOLAB_URI || "mongodb://localhost/crypto"
	};

	const jwt_config = {
		secretOrKey: devMode ? "some secret" : process.env.API_SECRET,
		jwtFromRequest: ExtractFromCookie,
		algorithms: "HS256"
	};

	const session_config = {
		secret: devMode ? "session secret" : process.env.SESS_SECRET,
		resave: false,
		saveUninitialized: true,
		authenticated: false,
		token: null,
		cookie: {
			maxAge: null, // set maxAge when user's authenticated
			secure: !devMode // devMode ? false : true
		}
	};

	return { serOpts: server_config, jwtOpts: jwt_config, sessOpts: session_config };
};
