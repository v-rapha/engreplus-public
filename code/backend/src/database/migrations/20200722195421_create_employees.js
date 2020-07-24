// Método "up" é sempre responsável pela criação da tabela
exports.up = function(knex) {
	return knex.schema.createTable('employees', function(table) {
		table.increments('id_employee').primary();
		table.string('name_employee').notNullable();
		table.string('password_employee').notNullable();
	});
};

// Método "down" caso deu algum problema, posso desfazer o que eu fiz pelo "down"
exports.down = function(knex) {
	knex.schema.dropTable('employees');
};
