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

    if (diffDays > 10) {
        return next(new ApiError(400, "Không thể mượn sách quá 10 ngày."));
    }

    const borrowService = new BorrowService(MongoDB.client);
    const number = await borrowService.numberBorrowByUser(req.body.reader)
    if (number > 4) {
        return next(new ApiError(400, "Bạn đã mượn quá 5 cuốn sách."));
    }

    const bookService = new BookService(MongoDB.client);
    const dataBook = await bookService.findById(req.body.book)
    if (dataBook.number === dataBook.borrowed) {
        return next(new ApiError(400, "Không đủ sách để mượn."));
    }
    
    try {
        // await bookService.updateBorowed(req.body.book, dataBook.borrowed + 1)
        const document = await borrowService.create({
            reader: req.body.reader,
            book: req.body.book,
            borrowDate: borrowTime,
            durationDate: durationTime,
        });
        return res.send(document);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
};

const find = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.find(req.query.name, req.query.number, req.query.column1, req.query.column2);
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const update = async (req, res, next) => {

    try {
        const borrowService = new BorrowService(MongoDB.client);
        const bookService = new BookService(MongoDB.client);
        const idDetail = await borrowService.getDetail(req.params.id)
        const dataBook = await bookService.findById(idDetail.book)
        if (idDetail.xacnhanmuon === '') {
            await bookService.updateBorowed(idDetail.book, dataBook.borrowed + 1)
            const document = await borrowService.update(req.params.id, { xacnhanmuon: new Date() });
            if (!document) {
                return next(new ApiError(404, "User not found"));
            }
        }
        else if (idDetail.ngaytra === '') {
            const document = await borrowService.update(req.params.id, { ngaytra: new Date() });
            if (!document) {
                return next(new ApiError(404, "User not found"));
            }
        }
        else if (idDetail.xacnhantra === '') {
            await bookService.updateBorowed(idDetail.book, dataBook.borrowed - 1)
            const document = await borrowService.update(req.params.id, { xacnhantra: new Date() });
            if (!document) {
                return next(new ApiError(404, "User not found"));
            }
        }
        console.log(idDetail.ngaytra)
        return res.send({ message: "User was update successfully" })
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const findByUser = async (req, res, next) => {
    let documents = [];
    try {
        const borrowService = new BorrowService(MongoDB.client);
        documents = await borrowService.findByUser(req.params.id, req.query.number, req.query.column1, req.query.column2);
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
    find,
    update,
    findByUser
}


