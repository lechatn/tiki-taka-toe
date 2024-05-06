const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.static("static"));
app.use("/IMG", express.static("static/IMG"));

const server = http.createServer((req, res, app) => {
  let reqUrl = url.parse(req.url);
  let fileName = "";
  let folderName = "templates";

  if (
    reqUrl.pathname.endsWith(".css") || reqUrl.pathname.endsWith(".js") ||
    reqUrl.pathname.endsWith(".png") || reqUrl.pathname.endsWith(".jpeg") ||
    reqUrl.pathname.endsWith(".json") || reqUrl.pathname.endsWith(".jpg")
  ) {
    fileName = reqUrl.pathname;
    folderName = "static";
  } else {
    switch (reqUrl.pathname) {
      case "/":
        fileName = "index.html";
        break;
      case "/game1.html":
        fileName = "game1.html";
        break;
      case "/game2.html":
        fileName = "game2.html";
        break;
      case "/game3.html":
        fileName = "game3.html";
        break;
      case "/game4.html":
        fileName = "game4.html";
        break;
      case "/game5.html":
        fileName = "game5.html";
        break;
      case "/signup.html":
        fileName = "signup.html";
        break;
    }
  }

  let filePath = path.join(__dirname, folderName, fileName);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(`Error: ${err}`);
    } else {
      let contentType = "text/html";
      if (fileName.endsWith(".css")) {
        contentType = "text/css";
      } else if (fileName.endsWith(".js")) {
        contentType = "text/javascript";
      } else if (fileName.endsWith(".png")) {
        contentType = "image/png";
        data = new Buffer(data, "binary");
      } else if (fileName.endsWith(".jpeg")) {
        contentType = "image/jpeg";
        data = new Buffer(data, "binary");
      } else if (fileName.endsWith(".json")) {
        contentType = "application/json";
      } else if (fileName.endsWith(".jpg")) {
        contentType = "image/jpg";
        data = new Buffer(data, "binary");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data, "binary");
    }
  });
});

const host = "localhost";
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});
