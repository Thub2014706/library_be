const express = require("express");
const cors = require("cors");
const usersRouter = require("./app/routes/users.route")
const bookRouter = require("./app/routes/books.route")
const publisherRouter = require("./app/routes/publisher.route")
const employeeRouter = require("./app/routes/employee.route")
const borrowRouter = require("./app/routes/borrow.route")
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", usersRouter)
app.use("/api/book", bookRouter)
app.use("/api/publisher", publisherRouter)
app.use("/api/employee", employeeRouter)
app.use("/api/borrow", borrowRouter)

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error.",
    });
});

app.get("/", (req, res) => {
    res.json("hello");
});

module.exports = app;