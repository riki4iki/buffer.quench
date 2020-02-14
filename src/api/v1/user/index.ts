import Router from "koa-router";

import { userLogic, sessionAuthService } from "service";

const userRouter = new Router();

import { social } from "./social";
import { threadRouter as thread } from "./thread";
import { dashBoardRouter } from "./dashboard";

userRouter.use("/social", sessionAuthService.checkSession, userLogic.currentUserMiddleware, social.routes());
userRouter.use("/thread", sessionAuthService.checkSession, userLogic.currentUserMiddleware, thread.routes());
userRouter.use("/dashboard", sessionAuthService.checkSession, userLogic.currentUserMiddleware, dashBoardRouter.routes());

userRouter.get("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.userEndPoint);
userRouter.put("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.updateEndPoint);
userRouter.delete("/", sessionAuthService.checkSession, userLogic.currentUserMiddleware, userLogic.deleteEndPoint);

export { userRouter };
