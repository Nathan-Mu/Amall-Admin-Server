const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: { type: String, required: true },
	auth_name: String,
	auth_time: Number,
	create_time: { type: Number, default: Date.now },
	menus: Array,
});

const Role = mongoose.model('roles', schema);

module.exports = Role;
