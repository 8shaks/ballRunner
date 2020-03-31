const express = require("express");
const bodyParser = require("body-parser");
const courts = require("./routes/api/courts");
const path = require("path");
const users = require("./routes/api/user");
const auth = require("./routes/api/auth");
const profiles = require("./routes/api/profile");
const mongoose = require("mongoose");
var mm_routing = require('./routes/api/mmRouting');
var properties = require('./matchmaking/properties');

// TODO
// BUG, AUTH TOKEN DOES NOT EXPIRE...
// User should be able to exit out of matchmaking on their own
// Add a caption that says we found a match, respons to text to cancel
// What time are they going to play?
// Check how token is supose to work since you shouldn't be using jwt_decode on front-end
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

// //passport middleware
// app.use(passport.initialize());
// require("./config/passport");(passport);

mongoose
  .connect(db, { useNewUrlParser: true ,useUnifiedTopology: true})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/profile", profiles);
app.use("/api/courts", courts);
app.use('/api/matchmaking', mm_routing(properties));
// Server static assets if in production
console.log('hello')
  //set static folder

app.use(express.static("client/public"));
 

const port = process.env.PORT || 5000;
console.log(port)
app.listen(port, () => console.log(`Server running on port ${port}`))
