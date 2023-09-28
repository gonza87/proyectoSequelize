const express = require("express");
const router = express.Router();

const articleController = require("./controllers/articleController");

router.get("/", articleController.getAll);
router.get("/home", articleController.index);

module.exports = router;
