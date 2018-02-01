const DEBUG = false;
const Auth = require("../lib/authcallback.js")("manual");
const Handlebars = require("handlebars");
const ServErr = require("../util/servError.js");
const htmlRoute = require("express").Router();
const { memoryStore } = require("../config/config.js");
const place = require("../lib/json/states.json");

require("../util/errorHandler")();

module.exports = function() {

  htmlRoute.get("/", function(req, res) {
    DEBUG && console.log(req.headers);
    res.status(200).render("homepage");
  });

  htmlRoute.get("/search", Auth, function(req, res, next) {
		const isUser = !res.locals.error;
    res.status(200).render("searchpage", { user: isUser });	
  });

  htmlRoute.get("/profile", Auth, function(req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      return res.status(302).redirect("/search");
    }
		const { user, session } = req;
		const userInfo = session[user._id];
    res.status(200).render("profilepage", { user: userInfo, place });
  });

  return htmlRoute;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");

// htmlRoute.get("/search/:id", function(req, res) {
//   let searchTerm = req.params.id;
//   res.status(200).send("/searchPage.html?item=" + searchTerm);
// });


// htmlRoute.post("/api/user", function(req, res) {
//    console.log(req);
//    //var query = {'username':req.user.username};
//    //var query - ('_id': req.user._id);
//    req.newData.username = req.user.username;
//    // req.newData.field = req.user.field;
//    db.User.findOneAndUpdate(query, req.newData, function(err, doc) {
//       if (err) return res.send(500, { error: err });
//       return res.send("succesfully saved");
//    });
// });