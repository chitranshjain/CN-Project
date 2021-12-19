const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./users");
const chatRoutes = require("./chat");

// Initializing express app and other features
const app = express();
const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Server running on port ${port} 🔥`))
const io = require('socket.io').listen(server);


dotenv.config();
app.use(bodyParser.json());

// CORS Rules Modification
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use(function (req, res, next) {
  req.io = io;
  console.log(req.io);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello");
});


mongoose
  .connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
  })
  .catch((err) => {
    console.log("An error occurred : " + err.message);
  });

app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use('', (req, res) => {
  res.send('api router not found');
})