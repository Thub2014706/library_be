const ApiError = require("../api-error");
const UserService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require('bcrypt')

const login = async (req, res, next) => {
    const {dienthoai, matkhau} = req.body;
    if (!dienthoai || !matkhau) {
        return res.status(400).send('Không được trống');
    }
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.login(dienthoai, matkhau);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Lỗi kết nối", error)
        );
    }
};

const register = async (req, res, next) => {
    const {ten, ngaysinh, gioitinh, diachi, dienthoai, matkhau} = req.body;
    if (!ten || !ngaysinh || !gioitinh || !diachi || !dienthoai || !matkhau) {
        return res.status(400).send('Không được trống');
    }
    try {
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(matkhau, salt);
        const userService = new UserService(MongoDB.client);
        const document = await userService.register({ten, ngaysinh, gioitinh, diachi, dienthoai, matkhau: hashedPassword});
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Lỗi kết nối", error)
        );
    }
};

const findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        documents = await userService.find(req.query.name, req.query.number)
        return res.send(documents);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const getDetail = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.getDetail(req.params.id);
        return res.send(document);
    } catch (error) {
        console.log(error)
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        res.send({ message: "User was update successfully" })
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
}

const deleteUser = async (req, res, next) => {   
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({ message: "Publisher was deleted succussfully" });
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
        );
    }
};

module.exports = {
    login,
    register,
    findAll,
    getDetail,
    update,
    deleteUser
}

