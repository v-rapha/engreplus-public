const connection = require('../database/connection');

module.exports = {
	// Register work
	async create(request, response) {
		try {
			const { client_work, description_work, value_work, date_work, dayPayment_work } = request.body;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const [ id_work ] = await connection('works').insert({
				client_work,
				description_work,
				value_work,
				date_work,
				dayPayment_work,
				employee_id
			});

			return response.json({ id_work });
		} catch (err) {
			console.log('Error in register work: ', err);
		}
	},

	// Listing all work
	async index(request, response) {
		try {
			const { page = 1 } = request.query;

			// Contando quantos works foram criados
			const [ count ] = await connection('works').count();

			response.header('X-Total-Count', count['count(*)']);

			const works = await connection('works')
				.join('employees', 'employees.id_employee', '=', 'works.employee_id')
				.limit(5)
				.offset((page - 1) * 5)
				.select([ 'works.*', 'employees.name_employee', 'employees.password_employee' ]);

			return response.json(works);
		} catch (err) {
			console.log('Error in listing all works: ', err);
		}
	},

	// Listing work specific
	async indexSpecific(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const works = await connection('works')
				.where('id_work', id_work)
				.select('client_work', 'description_work', 'value_work', 'date_work', 'dayPayment_work')
				.first();

			return response.json(works);
		} catch (err) {
			console.log('Error in listing specific work: ', err);
		}
	},

	// Delete work
	async delete(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const works = await connection('works').where('id_work', id_work).select('employee_id').first(); // Retorna apenas um resultado

			if (works.employee_id != employee_id) {
				return response.status(401).json({ err: 'Operation not permited' });
			}

			await connection('works').where('id_work', id_work).delete();

			return response.send('Operation executed with sucess!').status(204);
		} catch (err) {
			console.log('Error in delete work: ', err);
		}
	},

	//Update work
	async changes(request, response) {
		try {
			const { id_work } = request.params;
			//const employee_id = request.headers.authorization;
			const employee_id = request.id_employee;

			const { client_work } = request.body;
			const { description_work } = request.body;
			const { value_work } = request.body;
			const { date_work } = request.body;
			const { dayPayment_work } = request.body;

			const work = await connection('works').where('id_work', id_work).select('employee_id').first();

			if (work.employee_id != employee_id) {
				return response.status(401).json({ err: 'Operation not permited' });
			}

			await connection('works').where('id_work', id_work).update({
				client_work: `${client_work}`,
				description_work: `${description_work}`,
				value_work: `${value_work}`,
				date_work: `${date_work}`,
				dayPayment_work: `${dayPayment_work}`
			});

			return response.json(work);
		} catch (err) {
			console.log('Error in update employee: ', err);
		}
	}
};
