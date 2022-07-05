const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const app = express();

const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");

app.use(helmet());
app.use(passport.initialize());
//! Function to check user is logged in or not

const checkLoggedIn = (req, res, next) => {
  const isLoggedIn = true; //! TODO
  if (!isLoggedIn) {
    return res.status(401).send("You are not logged in");
  }
  // next();
};

require("dotenv").config();

const PORT = 3000;

const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Profile 🧑‍🦯", profile);
  done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    console.log("Redirecting to Google");
  }
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/",
    session: false,
  }),
  (req, res) => {
    console.log("Redirecting to Google");
  }
);
//! Logout
app.get("/auth/logout", (req, res) => {});

app.get("/secret", checkLoggedIn, (req, res) => {
  return res.send("You Personal secret number is 50");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// app.use(checkLoggedIn());

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
