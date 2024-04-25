
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const ApiError = require("../api-error");

class EmployeeService {
    constructor(client) {
        this.Employee = client.db().collection("employees");
    }

    extractEmployeeData(payload) {
        const employee = {
            ten: payload.name,
            ngaysinh: payload.birth,
            gioitinh: payload.gender,
            diachi: payload.address,
            dienthoai: payload.phone,
        };

        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return user;
    }
    
    async login(dienthoai, matkhau) {
        // const hashedPassword = bcrypt.hashSync(matkhau, 10);
 
        const employee = await this.Employee.findOne({ dienthoai: dienthoai });
        if (!employee) {
            return new ApiError(500, 'Người dùng không tồn tại!');
        }

        const passwordMatch = await bcrypt.compare(matkhau, employee.matkhau);
        if (!passwordMatch) {
            return new ApiError(500, 'Mật khẩu không đúng!');
        }

        const data = {
            _id: employee._id,
            ten: employee.ten,
        }

        const token = jwt.sign(data, 'ACCESS_TOKEN_SECRET', { expiresIn: '1d' });

        return token;
    }

    async register(data) {
        const employee = this.extractEmployeeData(data);
        const result = await this.Employee.insertOne(
            employee,
        )
        return result;
    }
}

module.exports = EmployeeService;