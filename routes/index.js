const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const connectEnsureLogin = require("connect-ensure-login");
const app = express();

const router = express.Router();
const Registration = mongoose.model("Registration");

//Passport

app.use(express.static(__dirname));

const bodyParser = require("body-parser");
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    secure: false,
    maxAge: 6000
  }

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

//const port = process.env.PORT || 3000;
//app.listen(port, () => console.log("App listening on port " + port));

/* PASSPORT SETUP */

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

/* MONGOOSE SETUP */

//const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


//const Schema = mongoose.Schema;
const NewUser = new mongoose.Schema({
  username: String,
  password: String
});

NewUser.plugin(passportLocalMongoose);
const NewUsers = mongoose.model("userInfo", NewUser, "userInfo");

/* PASSPORT LOCAL AUTHENTICATION */

passport.use(NewUsers.createStrategy());

passport.serializeUser(NewUsers.serializeUser());
passport.deserializeUser(NewUsers.deserializeUser());


// Routes

// const router = express.Router();
// const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
}); 

router.post("/login", (req, res, next) => {
  passport.authenticate("local", 
  (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login?info=" + info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.post("/",
  [
    check("name").isLength({ min: 1 }).withMessage("Please enter a name"),
    check("psw").isLength({ min: 1 }).withMessage("Please enter a password"),
  ],
  async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // set user password to hashed password
      registration.psw = await bcrypt.hash(registration.psw, salt);
      registration
        .save()
        .then(() => {
          res.send(" Sign Up Successful!");
        })
        .catch((err) => {
          console.log(err);
          res.send("Sorry! Something went wrong.");
        });
    } else {
      res.render("signup", {
        title: "Sign Up Page",
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

//Registration
//const mongoose = require("mongoose");

// //initial route

router.get("/",
  
  (req, res) => {
    res.render("index", { title: "Sign Up Page" });
  }
);


//Route for Users
router.get('/registrations', basic.check((req, res) => {
  Registration.find()
  .then((registrations) => {
  res.render('users', {title: 'Displaying users', registrations});
})
  .catch(() => { res.send('Sorry! Something went wrong.'); });
}));

//Route for Sign Up Page
router.get('/signup', 
(req, res) => {
    res.render('signup', { title: "Sign Up Page" });
});

//Route for Log In Page
router.get('/login',
(req, res) => {
  res.render('login')
});
router.get("/login", 
connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile("views/login.pug");
});

//Route for Clients
router.get('/clients',
(req, res) => {
  res.render('clients')
});



//added route for user
router.get("/user", connectEnsureLogin.ensureLoggedIn(), (req, res) =>
  res.send({ user: req.user })
);


  /* REGISTER SOME USERS*/
  
 NewUsers.register({ username: "Zoz", active: false }, "zoya");
 NewUsers.register({ username: "Elz", active: false }, "el");
 NewUsers.register({ username: "rpaz", active: false }, "rpa");

 



module.exports = router;

