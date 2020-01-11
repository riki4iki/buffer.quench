import { Context } from "koa";
import Router from "koa-router";

const router = new Router();

import { router as v1 } from "./v1";

router.use("/v1", v1.routes());

export { router };
