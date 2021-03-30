let fs = require('fs');
let dayjs = require('dayjs');
const { GENERAL } = require('../log/logFileNames');

const write = (logFileName, lines) => {
	let ws = fs.createWriteStream(`./log/${logFileName}`, { flags: 'a' });
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

module.exports = { write, writeLoginEntry };
