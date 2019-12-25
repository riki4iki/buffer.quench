import Koa, { Context } from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";

import { Cron } from "./lib";

const app = new Koa();
const router = new Router();

const api: Router = require("./api");

router.use("/api", api.routes(), api.allowedMethods());

const cron = new Cron();
cron.addListeners(app);

app
  .use(logger())
  .use(bodyparser())
  .use(cors())
  .use(helmet())
  .use(router.routes());

app.on("error", (err: any, ctx: Context) => {
  console.log(err);
  ctx.status = err.status || err.statusCode || 500;
  if (err.validationArray) {
    ctx.body = err.validationArray;
  } else {
    ctx.res.end(err.message);
  }
});

export = app;
