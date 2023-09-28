const db = require("../models/index");

async function getAll(req, res) {
  const articles = await db.Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: db.Author }],
  });
  res.json(articles);
}

async function index(req, res) {
  const articles = await db.Article.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: db.Author }],
  });

  res.render("home", { articles });
}

 async function articles (req, res)  {
   res.render("articles");
 };

 async function newarticle (req, res) {
   res.render("newarticle");
 };

 async function adminAuthor (req, res)  {
   const articles = await db.Article.findAll({
     order: [["createdAt", "DESC"]],
     include: [{ model: db.Author }],
   });

   res.render("admin", { articles });
 };

 async function articleId (req, res)  {
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
 };

 async function newArtAut (req, res)  {
   const authors = await db.Author.findAll();
   res.render("newarticle", { authors });
 };

 async function vistaArticle (req, res)  {
   await db.Article.create({
     title: req.body.title,
     content: req.body.content,
     image: req.body.image,
     authorId: req.body.author,
   });
   res.redirect("/admin");
 };

 async function newComents (req, res) {
   await db.Comment.create({
     name: req.body.name,
     content: req.body.content,
     articleId: req.body.idarticle,
   });
   res.redirect(`/article/${req.body.idarticle}`); //redirijo a la misma pagina del articulo
 };

 async function deleteArticle (req, res) {
   const articleId = req.params.id;

   // Elimina el artículo con el ID proporcionado
   await db.Article.destroy({
     where: { id: articleId },
   });
   // Redirecciona hacia la página de administración
   res.redirect("/admin");
 };
 //editar articulo
 async function editAricle (req, res)  {
   const article = await db.Article.findByPk(req.params.id);
   res.render("edit", { article });
 };

 async function patchEdit (req, res)  {
   const article = await db.Article.findByPk(req.params.id);
   await article.update({
     title: req.body.title,
     content: req.body.content,
     image: req.body.image,
   });
   res.redirect("/admin");
 };




module.exports = {
  getAll,
  index,
  articles,
  newarticle,
  adminAuthor,
  articleId,
  newArtAut,
  vistaArticle,
  newComents,
  deleteArticle,
  editAricle,
  patchEdit,
};
