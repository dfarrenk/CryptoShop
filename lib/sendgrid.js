const DEBUG = true;
require("dotenv").config();

const sg = require("sendgrid")(process.env.SENDGRID_APIKEY);
const fs = require("fs");
const path = require("path");
const templates = path.join(__dirname, "/mailtemplates");

const fileImport = function(filepath) {
   const data = fs.readFileSync(filepath, "utf8");
   return data;
};

const emailTemplates = {};
// there are two possible way to create custom email,
// one with prewritten pages another with template + prewritten contents
fs
   .readdirSync(templates)
   .filter(file => {
      return file.indexOf(".") !== 0 && file.slice(-5) === ".html";
   })
   .forEach(file => {
      const filepath = path.join(templates, file);
      const html = fileImport(filepath);
      emailTemplates[file] = html;
   });

// flag tells mailer which template to use
// email({ options }, flag);
// obj key name: email, username, password, challenge_id, challenge_proof
module.exports = function(hostname, user, token) {
   const { username, email } = user;

   // have to figure out how to get the hostname with https
   const link = `${"https://localhost:4443"}/user/verification?t=${token}`;

   const substrings = {
      "%username%": username,
      "%link%": link,
      "%linktext%": "Click to verify"
   };

   console.log(emailTemplates["verification.html"]);
   
   const mailContent = emailTemplates["verification.html"].replace(/\%\w+(?![>])?\%/gi, (matched) => {
      return substrings[matched];
   });

   const request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
         personalizations: [{
            to: [{
               email: email
            }],
            subject: "Welcome to CryptoShop"
         }],
         from: {
            email: "CryptoSHOP@dogecoinisawesome.org"
         },
         content: [{
            type: 'text/html',
            value: mailContent
         }]
      },
      tracking_settings: {
         click_tracking: {
            enable: false
         }
      }
   });

   console.log(request);

   // With promise
   sg
      .API(request)
      .then(function(response) {
         console.log(response.statusCode);
         console.log(response.body);
         console.log(response.headers);
      })
      .catch(function(error) {
         console.log(error.body);
         console.log(error.headers);
         console.log(error.response.statusCode);
      });
};