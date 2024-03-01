const http = require("http");
const { createClient } = require("redis");

const getClient = async () => {
	const client = createClient({
		url: process.env["redis_uri"] || "redis://localhost",
	});
	client.on("error", (err) => {
		console.error(err);
	});
	await client.connect();
	return client;
};

const run = async () => {
	console.log("Starting");
	const server = http.createServer(async (req, res) => {
		console.log(req.url, req.method);
		res.statusCode = 200;
		res.setHeader("Content-Type", "text/plain");
		if (req.method !== "POST") {
			res.end("Hello");
			return;
		}
		const client = await getClient();
		let counter = (await client.get("counter")) || 0;
		counter++;
		await client.set("counter", counter);
		res.end("Counter: " + counter);
		await client.disconnect();
	});

	const hostname = "0.0.0.0";
	const port = 80;

	console.log("Starting server");
	server.listen(port, hostname);
};

run();
