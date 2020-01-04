import Router from "koa-router";
const router = new Router();
import { userLogic } from "../../../service";
import { authServise as AuthService } from "../../../service";
const sessionController = AuthService.sessionAuthService;

import { social } from "./social";
import { threadRouter as thread } from "./thread";

router.use("/social", sessionController.checkSession, userLogic.currentUserMiddleware, social.routes());

router.use("/thread", sessionController.checkSession, userLogic.currentUserMiddleware, thread.routes());

router.get("/", sessionController.checkSession, userLogic.currentUserMiddleware, userLogic.userEndPoint);
router.put("/", sessionController.checkSession, userLogic.currentUserMiddleware, userLogic.updateEndPoint);

router.delete("/", sessionController.checkSession, userLogic.currentUserMiddleware, userLogic.deleteEndPoint);

export { router };
