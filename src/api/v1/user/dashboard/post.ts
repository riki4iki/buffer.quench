import Router from "koa-router";

import { DashboardService } from "service/thread.service/dashboard.service";
import apiMiddleware from "service/api";

const postDashboardRouter = new Router();

postDashboardRouter.get("/", DashboardService.getDashboard);
postDashboardRouter.post("/", DashboardService.createPostDashboard);

postDashboardRouter.put("/:id", apiMiddleware.validateUUIDMiddleware, DashboardService.updatePostDashboard);

export { postDashboardRouter };
