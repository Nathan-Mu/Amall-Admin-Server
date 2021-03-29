const express = require('express');
const routes = require('./routes/index');

const app = express();

app.use('/', routes);

app.listen(9000, () => {
	console.log('Success: Server started');
});
