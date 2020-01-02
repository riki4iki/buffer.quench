import Router from "koa-router";
const router = new Router();

import { router as auth } from "./auth";
import { router as user } from "./user";

router.use("/user", user.routes()).use("/auth", auth.routes());

router.all("/", async (ctx, next) => {
   ctx.status = 306;
   await next();
});

export { router };
