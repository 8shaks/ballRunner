const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const courts = require("./routes/api/courts");
const path = require("path");
const users = require("./routes/api/user");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

app.use(passport.initialize());

// require("./config/passport.js")(passport);

mongoose
  .connect(db, { useNewUrlParser: true ,useUnifiedTopology: true})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));

// app.use("/api/users", users);
// app.use("/api/profile", profiles);
app.use("/api/courts", courts);

// Server static assets if in production

  //set static folder

  app.use(express.static("client/public"));
 

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`))
