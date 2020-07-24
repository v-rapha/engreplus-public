const connection = require('../database/connection');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secret = 'secret-value';

module.exports = {
	// Login employee
	async session(request, response) {
		try {
			const { name } = request.body;
			const { password } = request.body;

			const employee = await connection('employees').where('name_employee', name).first();

			if (!employee) {
				return response.status(400).json({ error: 'Check the data entered.' });
			}

			const comparePassword = await bcrypt.compare(password, employee.password_employee);

			if (!comparePassword) {
				return response.status(400).send('Password are wrong');
			}

			const { id_employee } = employee;

			let token = jsonwebtoken.sign({ id_employee }, secret, {
				expiresIn: 300 // 5min para token expirar
			});

			response.json({ employee, token, auth: true });
		} catch (err) {
			console.log('Employee login error: ', err);
		}
	},

	// Método que vai retornar os works específicos de um employee
	async index(request, response) {
		try {
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const works = await connection('works').where('employee_id', employee_id).select('*');

			return response.json(works);
		} catch (err) {
			console.log('Error in listing works ', err);
		}
	}
};
