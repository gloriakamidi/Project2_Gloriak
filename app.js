const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser'); // To retrieve user's data



const app = express();

/* SSL */

const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https
  .createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  })
  //.listen(3000);

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressSession);

// app.use(passport.initialize());
// app.use(passport.session());

//passport.use(registrationSchema.createStrategy());

app.use('/', routes);

// const https = require("https");
// const fs = require("fs");

// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem"),
// };

// https
//   .createServer(options, function (req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
//   })
//   //.listen(3000);

module.exports = app;