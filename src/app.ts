import Koa, { Context } from "koa";
import Router from "koa-router";
import bodyparser from "koa-bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";
import { setHeaders } from "./lib";

const app = new Koa();
const router = new Router();

import { router as api } from "./api";

router.use("/api", api.routes(), api.allowedMethods());

app.use(logger())
   .use(bodyparser())
   .use(cors())
   .use(helmet())
   .use(setHeaders)
   .use(router.routes());

app.on("error", (err: any, ctx: Context) => {
   console.log(err);
   ctx.status = err.status || err.statusCode || 500;
   if (err.validationArray) {
      //throw error mean class-validator exception to target resource, error.status = 400
      ctx.body = err.validationArray;
   } else {
      const isDev = process.env.NODE_ENV === "development";
      const isInternalServer = err.status === 500;

      ctx.res.end((isInternalServer && !isDev && "Internal server error") || err.message);
   }
});

export { app };
