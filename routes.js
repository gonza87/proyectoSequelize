const express = require("express");
const router = express.Router();

const articleController = require("./controllers/articleController");

router.get("/", articleController.getAll);
router.get("/home", articleController.index);
router.get("/articles", articleController.articles);
router.get("/articles/new", articleController.newarticle);
router.get("/admin", articleController.adminAuthor);
router.get("/article/:id", articleController.articleId);
router.get("/new", articleController.newArtAut);
router.post("/article", articleController.vistaArticle);
//crear comentarios
router.post("/newcoment", articleController.newComents);
//Eliminar
router.delete("/articles/:id", articleController.deleteArticle);
//editar articulo
router.get("/edit/:id", articleController.editAricle);

router.patch("/edit/:id", articleController.patchEdit);

module.exports = router;
