let fs = require('fs');
let path = require('path');
let dayjs = require('dayjs');
const { GENERAL, EXCEPTIONS } = require('../config/logFileNames');

const write = (logFileName, lines) => {
	logPath = path.join(__dirname, '..', `/log/${logFileName}`);
	let ws = fs.createWriteStream(logPath, { flags: 'a' });
	lines.forEach(line => {
		ws.write(line + '\n');
	});
	ws.write('\n');
	ws.close();
};

const writeLoginEntry = (result, username, other) => {
	let lines = [
		`# Login - ${result}`,
		`User: ${username}`,
		`Date: ${dayjs().format('DD/MMM/YYYY HH:mm:ss')}`,
	];
	if (other) lines.push(other);
	write(GENERAL, lines);
};

const writeExceptionEntry = (where, exception, other) => {
	let exceptions = [
		`# Where - ${where}`,
		`Date: ${dayjs().format('DD/MMM/YYYY HH:mm:ss')}`,
		`Error: ${exception}`,
	];
	if (other) exceptions.push(other);
	write(EXCEPTIONS, exceptions);
};

module.exports = { write, writeLoginEntry, writeExceptionEntry };
