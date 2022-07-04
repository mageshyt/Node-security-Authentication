const path = require("path");
const fs = require("fs");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
const app = express();
app.use(helmet());

require("dotenv").config();
const PORT = 3000;
app.get("/secret", (req, res) => {
  return res.send("You Personal secret number is 50");
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(helmet());

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

const get = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
