import Router from "koa-router";
const router = new Router();
import jwt from "../../../lib/jwt";

const localAuthenticate: Router = require("./localAuth");
const facebookAuthenticate: Router = require("./fbAuth");

router
  .use("/localAuth", localAuthenticate.routes())
  .use("/fbAuth", facebookAuthenticate.routes());

router.get("/", async (ctx, next) => {
  ctx.status = 306;
  await next();
});
router.post("/refresh", async (ctx, next) => {
  const refresh = ctx.request.body.refresh_token;
});
export = router;
