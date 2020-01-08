import Router from "koa-router";
const router = new Router();
import { userLogic, sessionAuthService } from "../../../service";
import { social } from "./social";
import { threadRouter as thread } from "./thread";

router.use("/social", sessionAuthService.checkSession, userLogic.currentUserMiddleware, social.routes());

router.use("/thread", sessionAuthService.checkSession, userLogic.currentUserMiddleware, thread.routes());

router.get("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.userEndPoint);
router.put("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.updateEndPoint);

router.delete("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.deleteEndPoint);

export { router };
