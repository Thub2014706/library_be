const { ObjectId } = require("mongodb");

class BorrowService {
    constructor(client) {
        this.Borrow = client.db().collection("borrow");
    }

    extractBorrowData(payload) {
        const borrow = {
            reader: new ObjectId(payload.reader),
            book: new ObjectId(payload.book),
            borrowDate: payload.borrowDate,
            durationDate: payload.durationDate,
            return: payload.return
        };

        Object.keys(borrow).forEach(
            (key) => borrow[key] === undefined && delete borrow[key]
        );
        return borrow;
    }

    async create(payload) {
        const borrow = this.extractBorrowData(payload);
        const result = await this.Borrow.findOneAndUpdate(
            borrow,
            { $set: { return: 0 } },
            { returnDocument: "after", upsert: true }
        )
        return result;
    }

    async findBorrowing(name, number) {
        const all = await this.Borrow.find({return: 0, durationDate: { $gte: new Date() }}).toArray()
        const relation = await this.Borrow.aggregate([
            {
                $match: {
                    _id: { $in: all.map(value => value._id) }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reader",
                    foreignField: "_id",
                    as: "reader_details",
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book_details",
                }
            }
        ]).toArray();

        const result = relation.filter(doc => 
            doc.reader_details[0].name.match(new RegExp(name, 'i')) || 
            doc.book_details[0].name.match(new RegExp(name, 'i'))
        );
        // console.log(reader)
        const start = (number - 1) * 6; 
        const end = start + 6; 
        const newArray = result.slice(start, end); 

        const totalPages = Math.ceil(result.length / 6);

        
    
        return {
            data: newArray,
            totalPages: totalPages
        };
    }

    async findReturned(name, number) {
        const all = await this.Borrow.find({ 
            $expr: {
                $lte: ["$return", "$durationDate"]
            }
         }).toArray()
        // console.log()
        const relation = await this.Borrow.aggregate([
            {
                $match: {
                    _id: { $in: all.map(value => value._id) }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reader",
                    foreignField: "_id",
                    as: "reader_details",
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book_details",
                }
            }
        ]).toArray();

        const result = relation.filter(doc => 
            doc.reader_details[0].name.match(new RegExp(name, 'i')) || 
            doc.book_details[0].name.match(new RegExp(name, 'i'))
        );
        // console.log(reader)
        const start = (number - 1) * 6; 
        const end = start + 6; 
        const newArray = result.slice(start, end); 

        const totalPages = Math.ceil(result.length / 6);

        
    
        return {
            data: newArray,
            totalPages: totalPages
        };
    }

    async findLate(name, number) {
        const all = await this.Borrow.find({return: 0, durationDate: { $lt: new Date() }}).toArray()
        const relation = await this.Borrow.aggregate([
            {
                $match: {
                    _id: { $in: all.map(value => value._id) }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reader",
                    foreignField: "_id",
                    as: "reader_details",
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book_details",
                }
            }
        ]).toArray();

        const result = relation.filter(doc => 
            doc.reader_details[0].name.match(new RegExp(name, 'i')) || 
            doc.book_details[0].name.match(new RegExp(name, 'i'))
        );
        // console.log(reader)
        const start = (number - 1) * 6; 
        const end = start + 6; 
        const newArray = result.slice(start, end); 

        const totalPages = Math.ceil(result.length / 6);

        
    
        return {
            data: newArray,
            totalPages: totalPages
        };
    }

    async getDetail(id) {
        const result = await this.Borrow.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
        return result;
    }

    async numberBorrowByUser(id) {
        const number = await this.Borrow.countDocuments({
            reader: id
        })
        return number;
    }

    async returnTheBook(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const data = await this.Borrow.findOneAndUpdate(
            filter,
            { $set: { return: new Date() } },
            { returnDocument: "after", new: true }
        )
        return data;
    }

    async findReader(payload) {
        const result = await this.Borrow.find({
            reader: { $regex: new RegExp(payload), $options: "i" }
        }).toArray();
        return result;
    }

    async findBook(payload) {
        const result = await this.Borrow.find({
            book: { $regex: new RegExp(payload), $options: "i" }
        }).toArray();
        return result;
    }

}

module.exports = BorrowService;