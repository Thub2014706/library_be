const express = require("express");
const employees = require("../controllers/employee.controller");

const router = express.Router();

router.route("/")
    .post(employees.login)

module.exports = router;