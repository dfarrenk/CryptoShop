import ReactDOMServer from 'react-dom/server';
import express from 'express';

const app = express();

module.exports = function() {
	app.get('/react', (req, res) => {
		const html = ReactDOMServer.renderToString("<div>Hello World</div>");
		res.send(html);
	});
	return app;
}