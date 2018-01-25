const DEBUG = true;

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const templates = path.join(__dirname, "/mailtemplates");
const contextOptions = require("./mailtemplates/content.json");

dotenv.config();
const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);

const fileImport = function(filepath) {
   const data = fs.readFileSync(filepath, "utf8");
   return data;
};

const emailTemplates = {};

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

module.exports = function(options, flag) {
   const defOptions = {
      hostname: "https://localhost:4443",
      user: {},
      token: null,
   };

   const { hostname, user, token } = Object.assign(defOptions, options);
   const { username, email, password } = user;
   const { routes, subjects, linktext, flagname } = contextOptions;

   console.log("must be something wrong here %s this is the flag %s", password, flag);

   // have to figure out how to get the hostname with https
   const query = token ? `t=${token}` : "";
   const link = `${hostname}${routes[flag]}${query}`;

   const substrings = {
      "%username%": username,
      "%password%": password,
      "%link%": link,
      "%linktext%": linktext[flag]
   };

   const mailContent = emailTemplates[flagname[flag]].replace(/\%\w+(?![>])?\%/gi, (matched) => {
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
            subject: subjects[flag]
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

   DEBUG && console.log(request);

   // With promise
   sg
      .API(request)
      .then(function(response) {
         DEBUG && console.log(response.statusCode);
         DEBUG && console.log(response.body);
         DEBUG && console.log(response.headers);
      })
      .catch(function(error) {
         DEBUG && console.log(error.body);
         DEBUG && console.log(error.headers);
         DEBUG && console.log(error.response.statusCode);
      });
};