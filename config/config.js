const PassportJwt = require("passport-jwt");
const Fs = require("fs");
const ExtractJwt = PassportJwt.ExtractJwt;
const Jwt = require("jsonwebtoken");
const Uid = require("uid-safe");
const MongoStore = require("./store_config");
const memoryStore = require("./memoryStore.js");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const { "sess-resave-interval": resave, "sess-maxage": sessmax, devMode } = require("./config.json");

const dotenv = require("dotenv");

dotenv.config();

function ExtractFromSession(req) {
   console.log(req.session);
   const { authenticated, user } = req.session;
   try {
      if (!authenticated) {
         throw new Error("no token signed");
      }
    
      const { token, key } = user;
      const decoded = Jwt.verify(token, key); // decode with private key first
      return decoded.token;
   } catch (err) {
      console.log("this is token err");
      console.error(err);

      delete req.session.user;
      req.session.authenticated = false;
      return err.message;
   }
}

function GenUUIDAndEmit(req) {
   const string = Uid.sync(24);
   console.log("UID gen: %s", string);
   return string;
}
/////////////////////////////////////

/////////////////////////////////////
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
   mongoURL: process.env.MONGOLAB_URI || "mongodb://localhost/crypto"
};

const jwt_config = {
   secretOrKey: devMode ? "some secret" : process.env.JWT_SECRET,
   jwtFromRequest: ExtractFromSession,
   algorithms: "HS256"
};

const store_config = {
   url: server_config.mongoURL,
   ttl: sessmax,
   touchAfter: resave
};

// console.log(MongoStore);
const session_config = {
   store: new MongoStore(store_config),
   secret: devMode ? "session secret" : process.env.SESS_SECRET,
   resave: false,
   saveUninitialized: false,
   name: "ssid",
   authenticated: false,
   token: null,
   genid: GenUUIDAndEmit,
   cookie: {
      maxAge: null, // set maxAge when user's authenticated
      secure: !devMode // devMode ? false : true
   }
};

module.exports = {
   https_config,
   forceSSL_config,
   server_config,
   jwt_config,
   session_config,
   store_config,
   emitter,
   session_config,
   memoryStore
};