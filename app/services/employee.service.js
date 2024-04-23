
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const ApiError = require("../api-error");

class EmployeeService {
    constructor(client) {
        this.Employee = client.db().collection("employees");
    }
    
    async login(msnv, password) {
        console.log(msnv, password, "test");
        const hashedPassword = bcrypt.hashSync(password, 10);
 
        const employee = await this.Employee.findOne({ MSNV: msnv });
        if (!employee) {
            return new ApiError(500, 'Mã nhân viên không tồn tại!');
        }

        const passwordMatch = await bcrypt.compare(password, employee.Password);
        if (!passwordMatch) {
            return new ApiError(500, 'Mật khẩu không đúng!');
        }

        const token = jwt.sign({ msnv: msnv }, 'your_secret_key', { expiresIn: '365d' });

        return token;
    }
}

module.exports = EmployeeService;