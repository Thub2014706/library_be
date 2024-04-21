const { ObjectId } = require("mongodb");

class EmployeeService {
    constructor(client) {
        this.Employee = client.db().collection("employee");
    }

    extractEmployeeData(payload) {
        const employee = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.address,
            password: payload.password
        };

        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return employee;
    }

    async create(payload) {
        const employee = this.extractEmployeeData(payload);
        const result = await this.Employee.findOneAndUpdate(
            employee,
            { $set: { role: 0 } },
            { returnDocument: "after", upsert: true }
        )
        return result;
    }
}

module.exports = EmployeeService;