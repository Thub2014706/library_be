const { ObjectId } = require("mongodb");

class BookService {
    constructor(client) {
        this.Book = client.db().collection("books");
    };

    extractBookData(payload) {
        const book = {
            image: payload.image,
            name: payload.name,
            year: payload.year,
            number: Number(payload.number),
            borrowed: payload.borrowed,
            author: payload.author,
            publisher: new ObjectId(payload.publisher)
        };

        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
        const book = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: { borrowed: 0 } },
            { returnDocument: "after", upsert: true }
        )
        return result;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async find(name, number, show) {
        let query = { 
            $or: [
                {name: { $regex: new RegExp(name), $options: "i" }},
                {author: { $regex: new RegExp(name), $options: "i" }},
                {publisher: { $regex: new RegExp(name), $options: "i" }},
            ]
        }
        
        const result = await this.Book.find(query).toArray();
        
        const start = (number - 1) * show; 
        const end = start + show; 
        const newArray = result.slice(start, end); 
        const totalPages = Math.ceil(result.length / show)

        const relation = await this.Book.aggregate([
            {
                $match: {
                    _id: { $in: newArray.map(value => value._id) }
                }
            },
            {
                $lookup: {
                    from: "publisher",
                    localField: "publisher",
                    foreignField: "_id",
                    as: "publisher_details",
                },
            },
        ]).toArray();

        return {
            data: relation,
            totalPages: totalPages
        };
    }

    async getDetail(id) {
        const result = await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
        return result;
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async updateBorowed(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: { borrowed: payload } },
            { returnDocument: "after" }
        );
        return result;
    }

}

module.exports = BookService;