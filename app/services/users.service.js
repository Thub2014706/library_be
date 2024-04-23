const { ObjectId } = require("mongodb");
const moment = require('moment')

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            name: payload.name,
            birth: payload.birth,
            gender: payload.gender,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            current: new Date()
        };

        const date = new Date();

        date.setMonth(date.getMonth() + 12);

        user.duration = date;

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.insertOne(
            user,
            // { $set: { role: 0 } },
            // { returnDocument: "after", upsert: true }
        )
        return result;
    }
    // async find(filter, number) {
    //     const result = await this.User.find(filter).toArray();
    //     const start = (number - 1) * 10; 
    //     const end = start + 10; 
    //     const newArray = result.slice(start, end); 
    //     const totalPages = Math.ceil(result.length / 10)
    //     return {
    //         data: newArray,
    //         totalPages: totalPages
    //     };
    // }

    async find(name, number) {
        const result = await this.User.find({
            name: { $regex: new RegExp(name), $options: "i" },
        }).toArray();
        const start = (number - 1) * 10; 
        const end = start + 10; 
        const newArray = result.slice(start, end); 
        const totalPages = Math.ceil(result.length / 10)
        return {
            data: newArray,
            totalPages: totalPages
        };
    }

    async getDetail(id) {
        const result = await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
        return result;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = UserService;