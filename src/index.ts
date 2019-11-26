import http from "http";

import dotenv from "dotenv";
dotenv.config();

import Koa from "koa";

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx.URL);
  ctx.body = "antihyp12345678e";
  await next();
});

const server = http.createServer(app.callback());

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server start on port: ${process.env.PORT || 3000} `);
});
