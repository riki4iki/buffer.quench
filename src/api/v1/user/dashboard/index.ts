import Router from "koa-router";

import { postDashboardRouter } from "./post";

const dashBoardRouter = new Router();

dashBoardRouter.use("/post", postDashboardRouter.routes());

export { dashBoardRouter };
