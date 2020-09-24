import express from "express";
import mongoose from "mongoose";
import Cors from 'cors';
import Cards from "./dbCards.js";

//App Config
const app = express();
const port = process.env.PORT || 8001;
const connection_url =
  "mongodb+srv://TinderAdmin:a44u0aj0MeorJP1B@tinder.qlqre.mongodb.net/tinderdb?retryWrites=true&w=majority";

//Middlewares
app.use(express.json());
app.use(Cors());

//DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

//API endpoints
app.get("/", (request, response) =>
  response.status(200).send("HELLLLLOOOOOO!!!!!!")
);
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
app.get('/tinder/cards' , (request,response) => {
    Cards.find((error,data) => {
        if(error)
        {
            response.status(500).send(error);
        }
        else{
            response.status(200).send(data);
        }
    })
})

//Listner
app.listen(port, () => console.log(`listening on localhost ${port}`));
