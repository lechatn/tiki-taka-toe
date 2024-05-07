const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const url = require("url");
const path = require("path");
const express = require("express");
const os = require("os");
const bcrypt = require("bcrypt");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: __dirname + "/key.env" });

app.use(express.static("static"));
app.use("/IMG", express.static("static/IMG"));
app.use(express.json());

// Connect to MongoDB
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect().then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.use(express.json());

app.use(session({
  secret: "your secret key",
  resave: false,
  saveUninitialized: false,
}));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const collection = client.db("login").collection("login");

    // Find user with given email
    const user = await collection.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      req.session.email = email;
      res.json({ status: "success", message: "User logged in successfully" });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while logging in the user",
    });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const collection = client.db("login").collection("login");
    const pastUser = await collection.findOne({ email });

    if (pastUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await collection.insertOne({
      username,
      email,
      password: hashedPassword,
      totalGames: 0,
      totalWin: 0,
      totalLoss: 0,
      whoAreYaWin: 0,
      wordleWin: 0,
      bingoStatsWin: 0,
    });

    if (!result) {
      throw new Error("Failed to insert user into database");
    }

    req.session.username = username;
    req.session.user = result;
    req.session.email = email;

    res.json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user",
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while logging out",
      });
    } else {
      res.json({ status: "success", message: "User logged out successfully" });
    }
  });
});

app.post("/increment-win", async (req, res) => {
  const { email, game } = req.body;

  try {
    const collection = client.db("login").collection("login");

    // Find user with given email and increment the game field
    const result = await collection.updateOne({ email }, {
      $inc: { [game]: 1 },
    });
    await collection.updateOne({ email }, { $inc: { totalWin: 1 } });
    await collection.updateOne({ email }, { $inc: { totalGames: 1 } });

    if (result.matchedCount === 0) {
      throw new Error("No user found with given email");
    }

    res.json({
      status: "success",
      message: "User win count incremented successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while incrementing win count",
    });
  }
});

app.get("/is-logged-in", (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

app.get("/get-user-email", (req, res) => {
  if (req.session.user) {
    res.json({ status: "success", email: req.session.email });
  } else {
    res.status(401).json({ status: "error", message: "User not logged in" });
  }
});

app.get("/get-user-username", (req, res) => {
  if (req.session.user) {
    res.json({ status: "success", username: req.session.username });
  } else {
    res.status(401).json({ status: "error", message: "User not logged in" });
  }
});

app.get("/get-user-stats", async (req, res) => {
  if (req.session.user) {
    const collection = client.db("login").collection("login");
    const user = await collection.findOne({ email: req.session.email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({ status: "success", user });
  } else {
    res.status(401).json({ status: "error", message: "User not logged in" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

app.get("/game1.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "game1.html"));
});

app.get("/game2.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "game2.html"));
});

app.get("/game3.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "game3.html"));
});

app.get("/game4.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "game4.html"));
});

app.get("/game5.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "game5.html"));
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "signup.html"));
});

app.get("/account.html", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "account.html"));
});

process.on("SIGINT", async () => {
  await client.close();
  console.log("Disconnected from MongoDB");
  process.exit();
});

const server = http.createServer(app);
const io = socketIo(server);

let host;

const networkInterfaces = os.networkInterfaces();

for (const name of Object.keys(networkInterfaces)) {
  for (const net of networkInterfaces[name]) {
    if (net.family === "IPv4" && !net.internal) {
      host = net.address;
    }
  }
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});
