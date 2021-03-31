const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

const schema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	phone: String,
	email: String,
	create_time: { type: Number, default: Date.now },
	role_id: String,
});

const User = mongoose.model('users', schema);

User.findOne({ username: 'admin' }).then(user => {
	if (!user) {
		User.create({ username: 'admin', password: md5('admin') }).then(() => {
			console.log('>>> Root user init successfully');
			console.log('>>> Username: admin, Password: admin');
		});
	} else {
		console.log('>>> Root user existed');
	}
});

module.exports = User;
