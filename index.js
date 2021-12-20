const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require('cors')

const userRoutes = require("./users");
const chatRoutes = require("./chat");

// Initializing express app and other features
const app = express();
const port = process.env.PORT;

dotenv.config();
app.use(cors('dev'))
app.use(bodyParser.json());

// CORS Rules Modification
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   next();
// });

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
    app.listen(port || 8080, () => {
      console.log("App is up and running on port " + port);
    })
  })
  .catch((err) => {
    console.log("An error occurred : " + err.message);
  });