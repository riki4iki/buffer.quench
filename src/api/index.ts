import Router from "koa-router";
const router = new Router();

import { router as v1 } from "./v1";

router.use("/v1", v1.routes());

router.all("/", async (ctx, next) => {
   ctx.status = 306;
});

export { router };
