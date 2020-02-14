import Koa from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";

import "module-alias/register";

import { setHeadersMiddleware, httpHandler } from "./lib";

const app = new Koa();
const router = new Router();

import { router as api } from "./api";

router.use("/api", api.routes(), api.allowedMethods());

app.use(logger())
   .use(bodyparser())
   .use(cors())
   .use(helmet())
   .use(setHeadersMiddleware())
   .use(router.routes());

app.on("error", httpHandler);

export { app };
