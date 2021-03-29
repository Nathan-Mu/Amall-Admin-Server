const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');
const { PORT: DB_PORT, HOST: DB_HOST, NAME: DB_NAME } = require('./config/db');
const { PORT: APP_PORT } = require('./config/app');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', routes);

mongoose
	.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
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
