const express = require("express");
const borrow = require("../controllers/borrow.controller");

const router = express.Router();

router.route("/")
    .post(borrow.create)
    .get(borrow.find)    

router.route("/:id")
    .put(borrow.update)

router.route("/find-by-user/:id")
    .get(borrow.findByUser)

module.exports = router;