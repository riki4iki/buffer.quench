import Router from "koa-router";
const router = new Router();

const user: Router = require("./user");
const auth: Router = require("./auth");

router.use("/user", user.routes()).use("/auth", auth.routes());

router.all("/", async (ctx, next) => {
  ctx.status = 306;
  await next();
});

export = router;
