const { ObjectId } = require("mongodb");

class BorrowService {
    constructor(client) {
        this.Borrow = client.db().collection("borrow");
    }

    extractBorrowData(payload) {
        const borrow = {
            reader: payload.reader,
            book: payload.book,
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

    async find(name, number) {
        let query = {
            $or: [
                {reader: { $regex: new RegExp(name), $options: "i" }},
                {book: { $regex: new RegExp(name), $options: "i" }},
            ]
        }
        const result = await this.Borrow.find(query).toArray();
        if (number) {
            const start = (number - 1) * 6; 
            const end = start + 6; 
            const newArray = result.slice(start, end); 
    
            const totalPages = Math.ceil(result.length / 6);
        
            return {
                data: newArray,
                totalPages: totalPages
            };
        } else {
            return result
        }
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