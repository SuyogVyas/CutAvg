const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const postRoutes = require("./routes/route")
const userRoutes = require("./routes/user")
const path = require("path")


let cors = require('cors')
app.use(cors())

mongoose.set('strictQuery', true);

mongoose
  .connect(
    "mongodb+srv://suyog:gF4Cn2QGL26cAEh@cluster0.ihdzzr5.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DataBase!");
  })
  .catch((err) => {
    console.log("Connection Failed",err);
  });

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")))

//gF4Cn2QGL26cAEh

app.use("/api/posts",postRoutes)
app.use("/api/user",userRoutes)

module.exports = app;
