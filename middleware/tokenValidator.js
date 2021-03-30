const jwt = require('jsonwebtoken');
const { SECRET, WHITE_LIST } = require('../config/security');

const tokenValidator = (req, res, next) => {
	const url = req.url;
	if (WHITE_LIST.indexOf(url) > -1) {
		return next();
	}

	let token = req.headers['authorization'];
	if (!token) {
		return res.status(401).send({
			status: 1,
			msg: 'Please login to the system',
		});
	}
	jwt.verify(token, SECRET, (error, data) => {
		if (error) {
			return res.status(401).send({
				status: 2,
				msg: 'Token expired',
			});
		} else {
			req.user = data;
			return next();
		}
	});
};

module.exports = tokenValidator;
