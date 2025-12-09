const path = require('path');
const jsonServer = require('json-server');
const auth = require('json-server-auth');

const PORT = process.env.JSON_SERVER_PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults();

const rules = auth.rewriter({
  users: 600,
  categories: 640,
  products: 640,
});

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(rules);
server.use(auth);
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server + Auth is running on http://localhost:${PORT}`);
});

