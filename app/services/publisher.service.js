const { ObjectId } = require("mongodb");

class PublisherService {
    constructor(client) {
        this.Publisher = client.db().collection("publisher");
    }

    extractPublisherData(payload) {
        const publisher = {
            name: payload.name,
            address: payload.address,
        };

        Object.keys(publisher).forEach(
            (key) => publisher[key] === undefined && delete publisher[key]
        );
        return publisher;
    }

    async create(payload) {
        const publisher = this.extractPublisherData(payload);
        const result = await this.Publisher.insertOne(
            publisher,
            // { returnDocument: "after", upsert: true }
        )
        return result;
    }

    async delete(id) {
        const result = await this.Publisher.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractPublisherData(payload);
        const result = await this.Publisher.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async find(name, number) {
        const result = await this.Publisher.find({
            name: { $regex: new RegExp(name), $options: "i" },
        }).toArray();
        if (number) {
            const start = (number - 1) * 10; 
            const end = start + 10; 
            const newArray = result.slice(start, end); 
            const totalPages = Math.ceil(result.length / 10)
            return {
                data: newArray,
                totalPages: totalPages
            };
        } else {
            return result
        }
    }

    async getDetail(id) {
        const result = await this.Publisher.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
        return result;
    }
}

module.exports = PublisherService;