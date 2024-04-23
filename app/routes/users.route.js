const express = require("express");
const users = require("../controllers/users.controller");

const router = express.Router();

router.route("/")
    .post(users.create)
    .get(users.findAll)

router.route("/:id")
    .get(users.getDetail)
    .put(users.update)
    .delete(users.deleteUser)

module.exports = router;