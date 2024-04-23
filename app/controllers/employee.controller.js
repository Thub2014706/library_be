const EmployeeService = require("../services/employee.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

const login = async (req, res, next) => {
    try {
        const {msnv, password} = req.body;
        if (msnv.length == 0 || password.length == 0) {
            return res.status(400).send('Mã nhân viên hoặc mật khẩu không được để trống');
        }
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.login(msnv, password);
        res.cookie('token', document, { maxAge:  365 * 24 * 60 * 60, httpOnly: true });
        return res.status(200).json(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "Lỗi kết nối", error)
        );
    }
};

module.exports = {
    login
}