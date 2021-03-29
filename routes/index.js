const express = require('express');
const categories = require('./categories');
const imageUpload = require('./imageUpload');
const products = require('./products');
const roles = require('./roles');
const users = require('./users');

const router = express.Router();

router.use('/test', (req, res, next) => {
	res.send('test');
});

router.use('/categories', categories);
router.use('/img/upload', imageUpload);
router.use('/products', products);
router.use('/roles', roles);
router.use('/users', users);

module.exports = router;
