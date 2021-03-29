const express = require('express');
const md5 = require('blueimp-md5');

const User = require('../models/User');

const router = express.Router();

// login
router.post('/', (req, res, next) => {
	const { username, password } = req.body;
	User.findOne(
		{ username, password: md5(password) },
		{ password: 0, __v: 0 }
	).then(user => {
		if (user) {
			console.log(`>>> Action: Login(${username})`);
			res.send('Login success');
		} else {
			console.log(`>>> Warning: Login failed(${username})`);
			res.send('Login failed');
		}
	});
});

module.exports = router;
