const EmployeeService = require("../services/employee.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require('bcrypt')

const login = async (req, res, next) => {
    const {dienthoai, matkhau} = req.body;
    if (!dienthoai || !matkhau) {
        return res.status(400).send('Không được trống');
    }
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.login(dienthoai, matkhau);
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
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.register({ten, ngaysinh, gioitinh, diachi, dienthoai, matkhau: hashedPassword});
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Lỗi kết nối", error)
        );
    }
};

module.exports = {
    login,
    register
}