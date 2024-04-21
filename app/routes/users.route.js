const express = require("express");
const users = require("../controllers/users.controller");

const router = express.Router();

router.route("/")
    .post(users.create)

module.exports = router;