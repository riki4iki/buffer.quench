import Router from "koa-router";
const router = new Router();

const v1: Router = require("./v1");

router.use("/v1", v1.routes());

router.all("/", async (ctx, next) => {
  ctx.status = 306;

  await next();
});

export = router;
