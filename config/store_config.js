const ExpSess = require("express-session");
const MongoStore = require("connect-mongo")(ExpSess);

module.exports = MongoStore;
