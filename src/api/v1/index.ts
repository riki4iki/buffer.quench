import Router from "koa-router";
const router = new Router();

import { router as auth } from "./auth";
import { router as user } from "./user";

router.use("/user", user.routes()).use("/auth", auth.routes());

export { router };
