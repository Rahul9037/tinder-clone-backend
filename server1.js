import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import Cards from "./Schemas/dbCards.js";
import Users from "./Schemas/dbUsers.js";
import UploadImage from "./Schemas/dbImage.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "./public",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");

//App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url =
  "mongodb+srv://TinderAdmin:a44u0aj0MeorJP1B@tinder.qlqre.mongodb.net/tinderdb?retryWrites=true&w=majority";

//Middlewares
app.use(express.json());
app.use(Cors());
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  session({ 
    key: "user_id",
    secret: "randomsecretstuff",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use((request, response, next) => {
  
  if (request.session.user && request.cookies.user_id) {
    var userdetails = request.session.user;
    console.log("userdetails:", userdetails);
    response.status(200).send(userdetails);
  }
  next();
});

var sessionChecker = (request, response, next) => {
  console.log("reached!!", request.session, "--",request.cookies.user_id);
  if (request.session.user && request.cookies.user_id) {
    //response.redirect('/home');
    console.log("request:", request.session);
  } else {
    next();
  }
};

//DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//API endpoints
app.get("/", sessionChecker,(request, response) => {
  console.log("Cookies: ", request.cookie);
  response.status(200).send("HELLLLLOOOOOO!!!!!!");
});

app.post("/tinder/cards", (request, response) => {
  const dbCard = request.body;
  Cards.create(dbCard, (error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(201).send(data);
    }
  });
});

// <------------------------------------->

app.get("/tinder/cards", (request, response) => {
  Users.find((error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(data);
    }
  });
});

// <------------------------------------->

app.post("/register", (request, response) => {
  const userdetails = request.body;
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      response.status(500).send(error);
    } else {
      bcrypt
        .hash(userdetails.password, salt)
        .then(function (hash) {
          // Store hash in your password DB.
          if (hash) {
            console.log("hashed pass", hash);
            userdetails.password = hash;
            Users.create(userdetails, (error, data) => {
              if (error) {
                response.status(500).send(error);
              } 
              else {
                console.log("reg:", data);
                response.status(201).send(data);
              }
            });
          }
        })
        .catch((error) => console.log("error=>", error));
    }
  });
});

// <------------------------------------->

app.post("/login", sessionChecker, (request, response) => {
  const logindetails = request.body;
  console.log("logindeta :" ,logindetails);
  Users.findOne({ email: logindetails.email }, (error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      bcrypt
        .compare(logindetails.password, data.password)
        .then(function (result) {
          // result == true
          if (result) {
            console.log("result=>", result);
            request.session.user = data;
            console.log("session:", request.session);
            response.status(201).send(data);
          } else {
            console.log("result=>", result);
            response.status(401).send("password error!!!");
          }
        })
        .catch((error) => console.log("error=>", error));
    }
  });
});

// <------------------------------------->

app.post("/upload", (req, res) => {
  upload(req, res, () => {
    console.log("Request ---", req.body.email);
    console.log("Request file ---", req.file); //Here you get file.
    Users.updateOne(
      { email: req.body.email },
      { $set: { profile: req.file } },
      (error, data) => {
        if (error) {
          res.status(500).send(error);
        } else {
          Users.findOne({ email: req.body.email }, (error, data) => {
            if (error) {
              response.status(500).send(error);
            } else {
              console.log("upload:", data);
              res.status(201).send(data);
            }
          });
        }
      }
    );
  });
});

// <------------------------------------->

app.get("/getimage", (request, response) => {
  UploadImage.find((error, data) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.status(200).send(data);
    }
  });
});

//Listner
app.listen(port, () => console.log(`listening on localhost ${port}`));
