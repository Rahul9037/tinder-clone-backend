const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv/config");

//App Configs:
const app = express();
const port = process.env.PORT || 8001;
const connection_url = process.env.CONNECTION_URL;

//Mongoose Connection
mongoose.connect(
  connection_url,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected")
);

//Import Routes
const loginRoutes = require("./routes/login");
const cardRoutes = require("./routes/cards");
const registerRoutes = require("./routes/register");
const uploadRoutes = require("./routes/updateProfilePic");
const sessionRoutes = require("./routes/sessionChecker");
const logoutRoutes = require("./routes/logout");

// Middlewares:
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));

app.use(
  session({
    key: "user_id",
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 600000,
      secure: true,
    },
  })
);

app.use(function(req,res,next){
  console.log(req.session);
  console.log("=========");
  next();
})

app.use("/login", loginRoutes);
app.use("/cards", cardRoutes);
app.use("/register", registerRoutes);
app.use("/upload", uploadRoutes);
app.use("/sessionChecker", sessionRoutes);
app.use("/logout", logoutRoutes);

app.listen(port, () => console.log("heyy on port 8001"));
