const express = require('express');

const Role = require('../models/Role');
const response = require('../utils/responseGenerator');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.send('roles');
});

/*
 * POST /roles/new
 * body: {roleName}
 */
router.post('/new', (req, res) => {
	const { roleName } = req.body;
	Role.create({ name: roleName })
		.then(role => {
			res.send(response.good({ role }));
		})
		.catch(error => {
			let where = 'Create role';
			logger.recordException(error, where, `role name: ${roleName}`);
			res.send(response.exception(where));
		});
});

/*
 * GET /roles/all
 */
router.get('/all', (req, res) => {
	Role.find({})
		.then(roles => {
			res.send(response.good({ roles }));
		})
		.catch(error => {
			let where = 'Get all roles';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * POST /update
 * body: {id, menus, auth_name}
 */
router.post('/update', (req, res) => {
	const newRole = req.body;
	const { id } = role;
	newRole.auth_time = Date.now();
	Role.findByIdAndUpdate(id, newRole)
		.then(role => {
			res.send(response.good(role));
		})
		.catch(error => {
			let where = 'Update role';
			logger.recordException(error, where, `new role: ${newRole}`);
			res.send(response.exception(where));
		});
});

module.exports = router;
