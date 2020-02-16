import Koa from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";
import moduleAlias from "module-alias";

import { setHeadersMiddleware, httpHandler } from "./lib";

moduleAlias.addAliases({
   types: __dirname + "/types",
   config: __dirname + "/config",
   service: __dirname + "/service",
   lib: __dirname + "/lib",
   models: __dirname + "/models",
});

//import "module-alias/register";

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
