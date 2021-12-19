const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./users");
const chatRoutes = require("./chat");

// Initializing express app and other features
const app = express();
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

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api", userRoutes);
app.use("/api", chatRoutes);

mongoose
  .connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server is up and running on port " + process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.log("An error occurred : " + err.message);
  });
