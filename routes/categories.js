const express = require('express');

const Category = require('../models/Category');
const logger = require('../utils/logger');

const router = express.Router();

/*
 * POST /category/new
 * body: {categoryName}
 */
router.post('/new', (req, res) => {
	const { categoryName } = req.body;
	Category.findOne({ name: categoryName }).then(category => {
		if (category) {
			res.send({ status: 1, msg: 'Category existed' });
		} else {
			Category.create({ name: categoryName })
				.then(category => {
					res.send({ status: 0, data: category });
				})
				.catch(error => {
					res.send({
						status: 1,
						msg: 'Exception occurs when creating a new category',
					});
					console.log('### Exception: Create a new category\n', error);
					logger.writeExceptionEntry(
						'Create new category',
						error,
						`Category name: ${categoryName}`
					);
				});
		}
	});
});

/*
 *	GET /category/all
 */
router.get('/all', (req, res) => {
	Category.find({})
		.then(categories => {
			res.send({ status: 0, data: categories });
		})
		.catch(error => {
			res.send({
				status: 1,
				msg: 'Exception occurs when retrieving all categories',
			});
			console.log('### Exception: Retrieve all categories\n', error);
			logger.writeExceptionEntry('Retrieve all categories', error);
		});
});

/*
 * POST /categories/update
 * body: {categoryId, categoryName}
 */
router.post('/update', (req, res) => {
	const { categoryId, categoryName } = req.body;
	Category.findOneAndUpdate({ id: categoryId }, { name: categoryName })
		.then(() => {
			res.send({ status: 0 });
		})
		.catch(error => {
			console.log('### Exception: Update category name\n', error);
			res.send({
				status: 1,
				msg: 'Exception occurs when updating a category name',
			});
			logger.writeExceptionEntry(
				'Update category',
				error,
				`_id: ${categoryId}, new name: ${categoryName}`
			);
		});
});

/*
 * GET /categories/info/:id
 * params: {id}
 */
router.get('/view/:id', (req, res) => {
	const { id } = req.params;
	Category.findOne({ _id: id })
		.then(category => {
			res.send({ status: 0, data: category });
		})
		.catch(error => {
			console.log('### Exception: Retrieve category by id\n', error);
			res.send({
				status: 1,
				msg: 'Exception occurs when retrieving a category by id',
			});
			logger.writeExceptionEntry(
				'Retrieve category by id',
				error,
				`_id: ${id}`
			);
		});
});

module.exports = router;
