import Router from "koa-router";
const router = new Router();

router.post("/login", async (ctx, next) => {
  ctx.body = "here must be login wit email/password";
});

export = router;
