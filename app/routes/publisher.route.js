const express = require("express");
const publisher = require("../controllers/publisher.controller");

const router = express.Router();

router.route("/")
    .post(publisher.create)
    .get(publisher.findAll)

router.route("/:id")
    .delete(publisher.deletePublisher)
    .get(publisher.getDetail)
    .put(publisher.update)

module.exports = router;