import Router from "koa-router";

import { tokenService as refreshController } from "service";

import { router as facebookAuthenticate } from "./fbAuth";
import { router as localAuthenticate } from "./localAuth";

const router = new Router();

router.use("/localAuth", localAuthenticate.routes()).use("/fbAuth", facebookAuthenticate.routes());

router.post("/refresh", refreshController.refresh);

export { router };
