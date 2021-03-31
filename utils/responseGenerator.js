const good = (data, other) => {
	let res = { status: 0, ...other };
	if (data) res.data = data;
	return res;
};

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
