const PassportJwt = require("passport-jwt");
const Fs = require("fs");
const ExtractJwt = PassportJwt.ExtractJwt;
const Jwt = require("jsonwebtoken");
const Uid = require("uid-safe");
const EventEmitter = require("events");
const emitter = new EventEmitter();


const dotenv = require("dotenv");

dotenv.config();

function ExtractFromSession(req) {
	const { authenticated, token, key } = req.session;
	console.log(req.session);

	if (authenticated) {
		try {
			const decoded = Jwt.verify(token, key); // decode with private key first
			return decoded.token;
		} catch (err) {
			err && console.log(err);

			delete req.session.token;
			delete req.session.key;
			req.session.authenticated = false;
			// req.session.save(err => {
			// 	console.log(err);
			// });

			return null;
		}
	}
	return null;
}

function GenUUIDAndEmit(req) {
	const string = Uid.sync(24);
	emitter.emit("create", string);
	console.log("UID gen: %s", string);
	return string;
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
		jwtFromRequest: ExtractFromSession,
		algorithms: "HS256"
	};

	const session_config = {
		secret: devMode ? "session secret" : process.env.SESS_SECRET,
		resave: false,
		saveUninitialized: false,
		name: "id",
		authenticated: false,
		token: null,
		genid: GenUUIDAndEmit,
		cookie: {
			maxAge: null, // set maxAge when user's authenticated
			secure: !devMode // devMode ? false : true
		}
	};

	const store_config = {
		url: server_config.mongoURL,
		ttl: 14 * 24 * 1 * 60 * 60,
		touchAfter: 30 * 60
	};

	return {
		https_config,
		forceSSL_config,
		server_config,
		jwt_config,
		session_config,
		store_config,
		emitter
	};
};

// Store.prototype.regenerate = function(req, fn) {
// 	var self = this;
// 	this.destroy(req.sessionID, function(err) {
// 		self.generate(req);
// 		fn(err);
// 	});
// };

// store.generate = function(req) {
// 	req.sessionID = generateId(req);
// 	req.session = new Session(req);
// 	req.session.cookie = new Cookie(cookieOptions);

// 	if (cookieOptions.secure === "auto") {
// 		req.session.cookie.secure = issecure(req, trustProxy);
// 	}
// };
