import { Context } from "koa";
import Router from "koa-router";
const router = new Router();

import { authServise } from "../../../service";
const refreshController = authServise.tokenService;

import { router as facebookAuthenticate } from "./fbAuth";
import { router as localAuthenticate } from "./localAuth";

router.use("/localAuth", localAuthenticate.routes()).use("/fbAuth", facebookAuthenticate.routes());

router.get("/", async (ctx: Context) => {
   //unused route
   ctx.status = 306;
});

router.post("/refresh", refreshController.refresh);

export { router };
