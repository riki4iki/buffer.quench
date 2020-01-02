import Router from "koa-router";
const router = new Router();
import { userLogic } from "../../../service";
import { authServise as AuthService } from "../../../service";

import { social } from "./social";
import { threadRouter as thread } from "./thread";

router.use("/social", AuthService.checkSession, userLogic.currentUserMiddleware, social.routes());

router.use("/thread", AuthService.checkSession, userLogic.currentUserMiddleware, thread.routes());

router.get("/", AuthService.checkSession, userLogic.currentUserMiddleware, userLogic.userEndPoint);
router.put("/", AuthService.checkSession, userLogic.currentUserMiddleware, userLogic.updateEndPoint);

router.delete("/", AuthService.checkSession, userLogic.currentUserMiddleware, userLogic.deleteEndPoint);

export = router;
