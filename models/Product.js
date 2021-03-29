const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	categoryId: { type: String, required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	desc: { type: String },
	status: { type: String, default: 1 },
	imgs: { type: Array, default: [] },
	details: { type: String },
});

const Product = mongoose.model('products', schema);

module.exports = Product;
