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
            ngaytra: payload.ngaytra,
            xacnhanmuon: payload.xacnhanmuon,
            xacnhantra: payload.xacnhantra
            // return: payload.return,
            // status: payload.status
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
            { $set: { xacnhanmuon: '', ngaytra: '', xacnhantra: '' }  },
            { returnDocument: "after",  upsert: true }
        )
        return result;
    }

    async find(name, number, column1, column2) {
        let all = []
        if (column2 === '') {
            all = await this.Borrow.find({ [column1]: { $ne: '' } }).toArray();
        } else all = await this.Borrow.find({ [column2]: '', [column1]: { $ne: '' } }).toArray();
        
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
            doc.reader_details[0].ten.match(new RegExp(name, 'i')) || 
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

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Borrow.findOneAndUpdate(
            filter,
            { $set: payload },
            { returnDocument: "after" }
        );
        return result;
    }

    async findByUser(id, number, column1, column2) {
        let all = []
        if (column2 === '') {
            all = await this.Borrow.find({ reader: new ObjectId(id), [column1]: { $ne: '' } }).toArray();
        } else all = await this.Borrow.find({ reader: new ObjectId(id), [column2]: '', [column1]: { $ne: '' } }).toArray();
        
        
        console.log(new ObjectId(id), number, column1, column2);
        
        const relation = await this.Borrow.aggregate([
            {
                $match: {
                    _id: { $in: all.map(value => value._id) }
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
    
        const start = (number - 1) * 10; 
        const end = start + 10; 
        const newArray = relation.slice(start, end); 
    
        const totalPages = Math.ceil(relation.length / 10);
        
        return {
            data: newArray,
            totalPages: totalPages
        };
    }
    

}

module.exports = BorrowService;