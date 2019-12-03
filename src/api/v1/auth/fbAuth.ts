import { Context } from "Koa";
import Router from "koa-router";
import { fbService } from "../../../lib";

const router = new Router();

router.post("/login", async (ctx: Context) => {
  const token = ctx.request.body.token;
  const response = await fbService
    .getUser(token)
    .catch(err => ctx.app.emit("error", err, ctx));
  ctx.body = response;
});

export = router;
