const ApiError = require("../api-error");
const BookService = require("../services/books.service");
const MongoDB = require("../utils/mongodb.util");

const create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
};

const deleteBook = async (req, res, next) => {   
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted succussfully" });
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
};

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({ message: "Publisher was update successfully" });
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findAll = async (req, res, next) => {
    let documents = [];
    try {
        const bookService = new BookService(MongoDB.client);
        documents = await bookService.find({});
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const getDetail = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.getDetail(req.params.id);
        return res.send(document);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

module.exports = {
    create,
    deleteBook,
    update,
    findAll,
    getDetail
}

