const express = require("express");
const users = require("../controllers/users.controller");

const router = express.Router();

router.route("/")
    .get(users.findAll)

router.route("/login")
    .post(users.login)

router.route("/register")
    .post(users.register)

router.route("/:id")
    .get(users.getDetail)
    .put(users.update)
    .delete(users.deleteUser)

module.exports = router;