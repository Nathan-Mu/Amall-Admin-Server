const express = require('express');

const Product = require('../models/Product');
const response = require('../utils/responseGenerator');
const logger = require('../utils/logger');

const router = express.Router();

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_PAGE_NO = 1;

const getOptions = ({ pageSize, pageNum, count }) => {
	if (count < pageSize * (pageNum - 1)) {
		return { msg: 'Page not found: pageSize * (pageNum - 1) > total' };
	}
	let skip = count - pageNum * pageSize;
	let limit = pageSize * 1;
	if (skip < 0) (limit += skip), (skip = 0);
	const options = { skip, limit };
	return { options };
};

/*
 * POST /products/new
 * body: {categoryId, name, desc, price, detail, imgs}
 */
router.post('/new', (req, res) => {
	const newProduct = req.body;
	const { name } = newProduct;

	Product.findOne({ name })
		.then(product => {
			if (product) {
				res.send(response.bad('Product name existed'));
				return new Promise(() => {});
			}
			return Product.create(newProduct);
		})
		.then(product => {
			res.send(response.good({ product }));
		})
		.catch(error => {
			let where = 'Create product';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * GET /products/all?
 * query: {pageNum, pageSize}
 */
router.get('/all', (req, res) => {
	const { pageNum = DEFAULT_PAGE_SIZE, pageSize = DEFAULT_PAGE_NO } = req.query;

	let total;

	Product.countDocuments()
		.then(count => {
			const { options, msg } = getOptions({ count, pageSize, pageNum });
			if (msg) return Promise.reject(msg);
			total = count;
			return Product.find({}, null, options);
		})
		.then(products => {
			const list = products.reverse();
			const data = { list, pageNum, pageSize, total };
			res.send(response.good(data));
		})
		.catch(error => {
			let where = 'Get category by page no and size';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * GET /products/search?
 * query: {pageNum, pageSize, productName} or {pageNum, pageSize, productDesc}
 */
router.get('/search', (req, res) => {
	const {
		pageNum = DEFAULT_PAGE_NO,
		pageSize = DEFAULT_PAGE_SIZE,
		productName,
		productDesc,
	} = req.query;

	let total;
	let condition = {};

	if (productName) {
		condition = { name: new RegExp(`^.*${productName}.*$`) };
	} else if (productDesc) {
		condition = { desc: new RegExp(`^.*${productDesc}.*$`) };
	}

	Product.countDocuments(condition)
		.then(count => {
			const { options, msg } = getOptions({ count, pageSize, pageNum });
			if (msg) return Promise.reject(msg);
			total = count;
			return Product.find(condition, null, options);
		})
		.then(products => {
			const list = products.reverse();
			const data = { list, pageNum, pageSize, total };
			res.send(response.good(data));
		})
		.catch(error => {
			let where = 'Get category by page no and size';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * GET /products/view/:id
 * params: {id}
 */
router.get('/view/:id', (req, res) => {
	const { id } = req.params;
	Product.findById(id)
		.then(product => {
			res.send(response.good({ product }));
		})
		.catch(error => {
			let where = 'Get product by id';
			logger.recordException(error, where);
			res.send(response.exception(where));
		});
});

/*
 * Get /products/update
 * body: {id, categoryId, name, desc, price, detail, imgs}
 */
router.post('/update/:id', (req, res) => {
	const product = req.body;
	const { id } = product;
	Product.findByIdAndUpdate(id, product)
		.then(() => {
			res.send(response.good());
		})
		.catch(error => {
			let where = 'Update product by id';
			logger.recordException(error, where, `product: ${product}`);
			res.send(response.exception(where));
		});
});

/*
 * POST /product/updateStatus
 * body: {productId, status}
 */
router.post('/product/updateStatus', (req, res) => {
	const { productId, status } = req.body;
	Product.findByIdAndUpdate(productId, { status })
		.then(() => {
			res.send(response.good());
		})
		.catch(error => {
			let where = 'Update product status by id';
			logger.recordException(
				error,
				where,
				`product id: ${productId}, status: ${status}`
			);
			res.send(response.exception(where));
		});
});

module.exports = router;
