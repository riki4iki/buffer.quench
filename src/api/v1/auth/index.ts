import Router from "koa-router";
const router = new Router();

const localAuthenticate: Router = require("./localAuth");
router.use("/localAuth", localAuthenticate.routes());

router.get("/", async (ctx, next) => {
  ctx.status = 306;
  await next();
});
router.post("/refresh", async (ctx, next) => {
  ctx.body = { data: "refresh token logic" };
});
export = router;
