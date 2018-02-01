const DEBUG = false;
const Join = require("path").join;
const _ = require("lodash");
const Auth = require("../lib/authcallback.js")("manual");
const ServErr = require("../util/servError.js");
const Uid = require("uid-safe").sync;
const htmlRoute = require("express").Router();
const { memoryStore } = require("../config/config.js");

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
    res.status(200).render("profilepage")
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

//Test route for getting Users from MongoDB. It will pull all user documents from the 'users' collection in the 'crypto' database.
// htmlRoute.get("/api/user", function(req, res) {
//    db.User.find({})
//    .then(function(dbUser) {
//       res.json(dbUser);
//    })
//    .catch(function(err) {
//       res.json(err);
//    });
// });

// //Test route to add a User
// htmlRoute.get("/api/user/testUser", function(req, res) {
//    console.log("herer");
//    let testUser = { name: "testUser", password: "1234", email: "testUser@gmail.com" };
//    db.User.create(testUser).then(function(res) {
//       console.log(`User inserted`);
//       res.status(200).json(res);
//    });
// });