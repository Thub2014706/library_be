const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.address,
            role: payload.role,
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            { $set: { role: 0 } },
            { returnDocument: "after", upsert: true }
        )
        return result;
    }
}

module.exports = UserService;