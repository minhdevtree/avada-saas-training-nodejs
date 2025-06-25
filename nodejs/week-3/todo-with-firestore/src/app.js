const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const routes = require('./routes/routes.js');

const app = new Koa();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(koaBody());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(5000);
