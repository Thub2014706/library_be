const ApiError = require("../api-error");
const UserService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");

const create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error has occurred")
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
    create,
    findAll,
    getDetail,
    update,
    deleteUser
}

