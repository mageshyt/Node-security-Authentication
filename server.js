const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const app = express();

const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");
require("dotenv").config();
const cookieSession = require("cookie-session");

const config = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  SECRET_KEY_1: process.env.SECRET_KEY_1,
  SECRET_KEY_2: process.env.SECRET_KEY_2,
};

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.clientID,
  clientSecret: config.clientSecret,
};

app.use(helmet());

app.use(
  cookieSession({
    name: "session",
    keys: [config.SECRET_KEY_1, config.SECRET_KEY_2], //! list of secrets value to keep the session secure
    maxAge: 24 * 60 * 60 * 1000, //! 24 hours
  })
);

app.use(passport.initialize());

app.use(passport.session());
//! Function to check user is logged in or not

const PORT = 3000;

function verifyCallback(accessToken, refreshToken, profile, done) {
  // console.log("Profile 🧑‍🦯", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

//! saves the session to he cookies
passport.serializeUser((user, done) => {
  console.log("serializeUser 🧑‍🦯");
  done(null, user.id);
});

//! Read the session form the cookie

passport.deserializeUser((userID, done) => {
  console.log("deserializeUser 🧑‍🦯", userID);

  done(null, userID);
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    console.log("Redirecting to Google");
  }
);

function CheckLoggedIn(req, res, next) {
  console.log("CheckLoggedIn 🧑‍🦯", req?.user);
  const isLoggedIn = req?.user && req.isAuthenticated(); //  DONE: check if user is logged in
  if (!isLoggedIn) {
    return res.status(401).send("You are not logged in");
  }
  next();
  // next();
}

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/",
    session: true,
  }),
  (req, res) => {
    console.log("Redirecting to Google");
  }
);
//! Logout
app.get("/auth/logout", (req, res) => {
  req.logOut(); // ! removes req.user and cleats any logged in session
  return res.redirect("/"); // ! redirects to home page
});

app.get("/secret", CheckLoggedIn, (req, res) => {
  return res.send("You Personal secret number is 50");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Server is listening on port ${PORT} 🚀 `);
  });
