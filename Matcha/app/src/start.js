const http = require("http");
const app = require("./index");
const io = require("./sockets/socket");

const server = http.createServer(app.callback());
const port = process.env['APP_PORT'] || 3000;

server.on("listening", () => {
  console.log(`listening on port ${port}`)
});

server.on("error", (error) => {
  console.error(error)
});

setInterval(io.queueCheck, 1000);

server.listen(port);
