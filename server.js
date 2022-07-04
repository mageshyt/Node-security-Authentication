const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());

//! Function to check user is logged in or not

const checkLoggedIn = (req, res, next) => {
  const isLoggedIn = true; //! TODO
  if (!isLoggedIn) {
    return res.status(401).send("You are not logged in");
  }
  // next();
};

app.get("/auth/google", (req, res) => {});
app.get("/auth/google/callback", (req, res) => {});
//! Logout
app.get("/auth/logout", (req, res) => {});

require("dotenv").config();

const PORT = 3000;
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
    console.log(`Server is listening on port ${PORT} 😄 `);
  });

console.log(process.env.GOOGLE_CLIENT_ID);
