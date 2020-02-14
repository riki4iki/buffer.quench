import Router from "koa-router";
const postDashboardRouter = new Router();

import { DashboardService } from "../../../../service/thread.service/dashboard.service";
import apiMiddleware from "../../../../service/api";
postDashboardRouter.get("/", DashboardService.getDashboard);
postDashboardRouter.post("/", DashboardService.createPostDashboard);

postDashboardRouter.put("/:id", apiMiddleware.validateUUIDMiddleware, DashboardService.updatePostDashboard);

export { postDashboardRouter };
