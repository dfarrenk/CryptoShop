const DEBUG = false;
const Join = require("path").join;
const htmlRoute = require("express").Router();

require("../util/errorHandler")();

module.exports = function() {
   
   htmlRoute.get("/", (req, res) => {
      DEBUG && console.log("/");
      res.status(200).sendFile(Join(__dirname, "../view/homepage.html"));
   });

   htmlRoute.get("/search/:id", function(req, res) {
      let searchTerm = req.params.id;
      res.status(200).send("/searchPage.html?item=" + searchTerm);
   });

   return htmlRoute;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");

// htmlRoute.get("/login", (req, res) => {
//    // console.log(req.session);
//    console.log("get");
//    // res.clearCookie("jwt-token");
//    console.log(req.path);
//    console.log(req.session.id);
//    // res.send("/login");
//    res.sendFile(Join(__dirname, "./cryptoshopreact/public/login.html"));
//    // res.sendFile(Join(__dirname, "./cryptoshopreact/public/index.html"));
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