const good = (data, other) => ({
	status: 0,
	data,
	...other,
});

const bad = (msg, other) => ({
	status: 1,
	msg,
	...other,
});

const exception = (where, other) => ({
	status: 1,
	msg: `Exception occurs (${where})`,
	...other,
});

module.exports = { good, bad, exception };
