//@ts-check

const http = require('http');
const fs = require('fs');
const path = require('path')
const localtunnel = require('localtunnel');
const url = require('url')

const hostname = '127.0.0.1';

const serve = (req, res) => {

	const obj = url.parse(req.url, true)

	const name = path.basename(obj.pathname);
	const all = fs.readdirSync(__dirname);

	if (!all.includes(name)) {
		res.statusCode = 404;
		res.end();
		return;
	}

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Bypass-Tunnel-Reminder', 'yes');

	res.setHeader('Cross-Origin-Opener-Policy', 'same-origin'); //COOP
	res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); //COEP
	res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); //CORP
	// res.setHeader('Access-Control-Allow-Origin', '*'); //CORS

	res.end(fs.readFileSync(path.join(__dirname, name)).toString());
};

async function start(port = 8081) {

	const tunnel1 = await localtunnel({ port });
	const tunnel2 = await localtunnel({ port });

	const server = http.createServer(serve);
	server.listen(port, hostname, async () => {
		try {
			console.log(`[IFRAME] running at ${tunnel2.url}/iframe.html`);
			console.log(`[EMBEDDER] running at ${tunnel1.url}/index.html?${tunnel2.url}`);
		} catch (err) {
			console.error(err);
		}
	});
}

start()
