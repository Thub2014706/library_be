const express = require("express");
const books = require("../controllers/books.controller");

const router = express.Router();

router.route("/")
    .post(books.create)
    .get(books.findAll)

router.route("/:id")
    .put(books.update)
    .delete(books.deleteBook)
    .get(books.getDetail)

module.exports = router;