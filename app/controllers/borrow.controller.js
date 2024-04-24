const ApiError = require("../api-error");
const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");
const BookService = require("../services/books.service");


const create = async (req, res, next) => {
    const { durationDate } = req.body;

    const borrowTime = new Date();

    const durationTime = new Date(durationDate);
    const diffTime = durationTime - borrowTime;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
        return next(new ApiError(400, "Không thể mượn sách quá 7 ngày."));
    }

    const borrowService = new BorrowService(MongoDB.client);
    const number = await borrowService.numberBorrowByUser(req.body.reader)
    if (number > 4) {
        return next(new ApiError(400, "Không thể mượn quá 5 cuốn sách."));
    }

    const bookService = new BookService(MongoDB.client);
    const dataBook = await bookService.findById(req.body.book)
    if (dataBook.number === dataBook.borrowed) {
        return next(new ApiError(400, "Không đủ sách để mượn."));
    }
    
    try {
        await bookService.updateBorowed(req.body.book, dataBook.borrowed + 1)
        const document = await borrowService.create({
            reader: req.body.reader,
            book: req.body.book,
            borrowDate: borrowTime,
            durationDate: durationTime,
        });
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
};

const findBorrowing = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.findBorrowing(req.query.name, req.query.number);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findReturned = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.findReturned(req.query.name, req.query.number);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findLate = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.findLate(req.query.name, req.query.number);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const returnTheBook = async (req, res, next) => {
    try {
        const borrowService = new BorrowService(MongoDB.client);
        const document = await borrowService.returnTheBook(req.params.id);
        console.log(document)
        if (!document) {
            return next(new ApiError(404, "Borrow not found"));
        }
        return res.send({ message: "Borrow was update successfully" });
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findReader = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.find(req.query.reader);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findBook = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.find(req.query.book);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

module.exports = {
    create,
    findBorrowing,
    returnTheBook,
    findReader,
    findBook,
    findReturned,
    findLate
}


