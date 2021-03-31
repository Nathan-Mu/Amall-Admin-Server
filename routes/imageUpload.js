const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const response = require('../utils/responseGenerator');
const logger = require('../utils/logger');

const router = express.Router();

const dirPath = path.join(__dirname, '..', 'public/upload');
const storage = multer.diskStorage({
	destination: dirPath,
	filename: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${Date.now()}${ext}`);
	},
});
const upload = multer({ storage });

/*
 * POST /img/upload
 */
router.post('/img/upload', (req, res) => {
	res.send('image upload');
	upload.single('image')(req, res, error => {
		if (error) {
			let where = 'Upload image';
			logger.recordException(error, where);
			return res.send(where);
		} else {
			const file = req.file;
			res.send(
				response.good({
					name: file.filename,
					url: 'http://localhost:4000/upload/' + file.filename,
				})
			);
		}
	});
});

/*
 * POST /img/delete
 * body: {name}
 */
router.post('/img/delete', (req, res) => {
	const { name } = req.body;
	fs.unlink(path.join(dirPath, name), error => {
		if (error) {
			let where = 'Delete image';
			logger.recordException(error, where);
			res.send(response.exception(where));
		} else {
			res.send(response.good());
		}
	});
});

module.exports = router;
