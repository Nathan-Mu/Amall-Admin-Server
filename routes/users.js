const express = require('express');

const User = require('../models/User');
const logger = require('../utils/logger');
const response = require('../utils/responseGenerator');

const router = express.Router();

/*
 * POST /users/new
 * body: {username, password}
 */
router.post('/new', (req, res) => {
	const { username, password } = req.body;
	User.findOne({ username })
		.then(user => {
			if (user) {
				res.send(response.bad('Username existed'));
				return new Promise(() => {});
			}
			return User.create({
				username,
				password: md5(password || 'no password'),
			});
		})
		.then(user => {
			res.send(response.good(user));
		})
		.catch(error => {
			let where = 'Create user';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * POST /users/update
 * body: {id, username, phone, email, role_id}
 */
router.post('/update', (req, res) => {
	const newUser = req.body;
	const { id } = newUser;
	User.findByIdAndUpdate(id, user)
		.then(user => {
			res.send(response.good(user));
		})
		.catch(error => {
			let where = 'Update user';
			logger.recordException(error, where, `new user: ${newUser}`);
			res.send(response.exception(where));
		});
});

/*
 * POST /users/delete/:id
 * params: {id}
 */
router.post('/delete/:id', (req, res) => {
	const { id } = req.params;
	User.findByIdAndDelete(id).then(() => {
		res.send(response.good());
	});
});

/*
 * GET /users/all
 */
router.get('/all', (req, res) => {
	let users;
	User.find({ username: { $ne: 'admin' } })
		.then(normalUsers => {
			users = normalUsers;
			return RoleModel.find();
		})
		.then(roles => {
			res.send(response.good({ users, roles }));
		})
		.catch(error => {
			let where = 'Get all users';
			logger.recordException(error, where);
			res.send(response.exception(error));
		});
});

module.exports = router;
