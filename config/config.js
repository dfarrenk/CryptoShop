const PassportJwt = require("passport-jwt");
const Fs = require("fs");
const ExtractJwt = PassportJwt.ExtractJwt;
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function ExtractFromCookie(req) {
	const { authenticated, token, key } = req.session;

	if (authenticated) {
		try {
			const decoded = Jwt.verify(token, key); // decode with private key first
			return decoded.token;
		} catch (err) {
			console.log(err);
			return err;
		}
	}
	return null;
}

module.exports = function(dev) {
	const devMode = dev === "dev";

	const https_config = {
		pfx: Fs.readFileSync("./encryption/crypto.pfx"),
		passphrase: process.env.TLS_CERT_PASS
	};

	const forceSSL_config = {
		enable301Redirects: true,
		trustXFPHeader: false,
		httpsPort: devMode ? 4443 : 443,
		sslRequiredMessage: "SSL Required."
	};

	const server_config = {
		port: process.env.PORT || 8080,
		httpsPort: 4443,
		authyAPIKey: process.env.AUTHY_API_KEY,
		mongoURL: process.env.MONGOLAB_URI || "mongodb://localhost/crypto"
	};

	const jwt_config = {
		secretOrKey: devMode ? "some secret" : process.env.JWT_SECRET,
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

	return { https_config, forceSSL_config, server_config, jwt_config, session_config };
};
