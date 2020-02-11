import Router from "koa-router";
const postDashboardRouter = new Router();

import { DashboardService } from "../../../../service/thread.service/dashboard.service";
import apiMiddleware from "../../../../service/api";
postDashboardRouter.get("/", DashboardService.getDashboard);
postDashboardRouter.get("/:id", apiMiddleware.validateUUIDMiddleware, DashboardService.getPostInDashboard);
postDashboardRouter.post("/", DashboardService.createPostDashboard);

postDashboardRouter.put("/:id", DashboardService.updatePostDashboard);
postDashboardRouter.del("/:id", apiMiddleware.validateUUIDMiddleware, ctx => {
   ctx.body = " delete by id";
});

export { postDashboardRouter };
