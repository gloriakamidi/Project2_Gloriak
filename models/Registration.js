const mongoose = require("mongoose");


const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  psw: {
    type: String,
    trim: true,
  },
});

//const RegistrationCol = mongoose.model("Registration", registrationSchema);
module.exports = mongoose.model("Registration", registrationSchema);






// const express = require("express");
// const passport = require("passport");

//const passportLocalMongoose = require("passport-local-mongoose");

//const app = express();
//mongoose.connect('mongodb://localhost/project2app',
//{ useNewUrlParser: true, useUnifiedTopology: true });

// registrationSchema.plugin(passportLocalMongoose);
// const Registrations = mongoose.model("Registration", registrationSchema);

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(Registrations.createStrategy());

// passport.serializeUser(Registrations.serializeUser());
// passport.deserializeUser(Registrations.deserializeUser())