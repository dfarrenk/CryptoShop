"use strict";
const Users = require("../models").User;

class CRUD {
   create(user) {
      return Users.create(user);
   }

   read(searchfields) {
      return Users.findOne(searchfields);
   }

   update(uid, fields) {
      return Users.findOneAndUpdate({
         _id: uid
      }, {
         $set: fields
      }, {
         new: true
      });
   }

   updatePush(uid, fields) {
      return Users.findOneAndUpdate({
         _id: uid
      }, {
         $push: fields
      }, {
         new: true
      });
   }
}

module.exports = new CRUD();
console.log("CRUD: \x1b[32mloaded!\x1b[0m");
