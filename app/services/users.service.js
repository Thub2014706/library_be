const { ObjectId } = require("mongodb");
// const moment = require('moment')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }

    extractUserData(payload) {
        const user = {
            ten: payload.ten,
            ngaysinh: payload.ngaysinh,
            gioitinh: payload.gioitinh,
            diachi: payload.diachi,
            dienthoai: payload.dienthoai,
            matkhau: payload.matkhau
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async login(dienthoai, matkhau) {
        // const hashedPassword = bcrypt.hashSync(matkhau, 10);
 
        const user = await this.User.findOne({ dienthoai: dienthoai });
        if (!user) {
            return new ApiError(500, 'Người dùng không tồn tại!');
        }

        const passwordMatch = await bcrypt.compare(matkhau, user.matkhau);
        if (!passwordMatch) {
            return new ApiError(500, 'Mật khẩu không đúng!');
        }

        // const data = {
        //     _id: user._id,
        //     ten: user.ten,
        // }

        // const token = jwt.sign(data, 'ACCESS_TOKEN_SECRET', { expiresIn: '1d' });

        return user;
    }

    async register(data) {
        const user = this.extractUserData(data);
        const result = await this.User.insertOne(
            user,
        )
        return result;
    }

    async find(name, number) {
        const result = await this.User.find({
            ten: { $regex: new RegExp(name), $options: "i" },
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