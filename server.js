const express = require('express');
const mongoose = require('mongoose');

const logger = require('./utils/logger');
const routes = require('./routes/index');
const { PORT: DB_PORT, HOST: DB_HOST, NAME: DB_NAME } = require('./config/db');
const { PORT: APP_PORT } = require('./config/app');
const tokenValidator = require('./middleware/tokenValidator');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
	res.set(
		'Access-Control-Allow-Headers',
		'content-type, authorization, accept, X-Requested-With'
	);
	res.set('Access-Control-Max-Age', 86400);
	if (req.method.toLowerCase() === 'options') {
		return res.end();
	}
	next();
});

app.use(tokenValidator);

app.use('/', routes);

mongoose
	.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('### Success: Database connected');
		app.listen(APP_PORT, () => {
			let serverDetails = `Server started on http://localhost:${APP_PORT}`;
			console.log(`### Success: ${serverDetails}`);
			logger.recordServerStart(serverDetails);
		});
	})
	.catch(error => {
		console.log('### Error: Database connected failed', error);
	});
