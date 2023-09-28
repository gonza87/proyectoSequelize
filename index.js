require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const app = express();
const db = require("./models/index");

const routes = require("./routes");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Rutas

app.use(routes);




app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
  console.log("http://localhost:3000");
  console.log("http://localhost:3000/home");
});
