const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const { PORT, HOST, NAME } = require('./config/db');
const { PORT: APP_PORT } = require('./config/app');

const app = express();

app.use('/', routes);

mongoose
	.connect(`mongodb://${HOST}:${PORT}/${NAME}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('### Success: Database connected');
		app.listen(APP_PORT, () => {
			console.log(
				`### Success: Server started on http://localhost:${APP_PORT}`
			);
		});
	})
	.catch(error => {
		console.log('### Error: Database connected failed', error);
	});
