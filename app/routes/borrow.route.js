const express = require("express");
const borrow = require("../controllers/borrow.controller");

const router = express.Router();

router.route("/")
    .post(borrow.create)
    .get(borrow.findAll)

router.route("/:id")
    .put(borrow.returnTheBook)

router.route("/find-reader")
    .get(borrow.findReader)

router.route("/find-book")
    .get(borrow.findBook)

module.exports = router;