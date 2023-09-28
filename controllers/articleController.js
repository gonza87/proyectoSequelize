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

module.exports = { getAll, index };
