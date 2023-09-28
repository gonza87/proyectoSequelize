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

app.get("/articles", (req, res) => {
  res.render("articles");
});

app.get("/articles/new", (req, res) => {
  res.render("newarticle");
});

app.get("/admin", async (req, res) => {
  const articles = await db.Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: db.Author }],
  });

  res.render("admin", { articles });
});

app.get("/article/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id, {
    include: [{ model: db.Author }, { model: db.Comment }],
  });
  const cantidad = await db.Comment.count({
    //cuento los comentarios que tiene un articulo
    where: {
      articleId: req.params.id, // Aquí defines tu condición
    },
  });

  res.render("articles", { article, cantidad });
});

app.get("/new", async (req, res) => {
  const authors = await db.Author.findAll();
  res.render("newarticle", { authors });
});

app.post("/article", async (req, res) => {
  await db.Article.create({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    authorId: req.body.author,
  });
  res.redirect("/admin");
});

//crear comentarios
app.post("/newcoment", async (req, res) => {
  await db.Comment.create({
    name: req.body.name,
    content: req.body.content,
    articleId: req.body.idarticle,
  });
  res.redirect(`/article/${req.body.idarticle}`); //redirijo a la misma pagina del articulo
});

//Eliminar

app.delete("/articles/:id", async (req, res) => {
  const articleId = req.params.id;

  // Elimina el artículo con el ID proporcionado
  await db.Article.destroy({
    where: { id: articleId },
  });
  // Redirecciona hacia la página de administración
  res.redirect("/admin");
});

//editar articulo
app.get("/edit/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  res.render("edit", { article });
});

app.patch("/edit/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  await article.update({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
  });
  res.redirect("/admin");
});

app.listen(3000, () => {
  console.log("Servidor escuchando en puerto 3000");
  console.log("http://localhost:3000");
  console.log("http://localhost:3000/home");
});
