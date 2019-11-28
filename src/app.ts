import Koa from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";

const app = new Koa();
const router = new Router();

const api: Router = require("./api");

router.use("/api", api.routes(), api.allowedMethods());

app
  .use(logger())
  .use(bodyparser())
  .use(cors())
  .use(helmet())
  .use(router.routes());

export = app;
