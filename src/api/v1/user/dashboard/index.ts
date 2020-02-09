import Router from "koa-router";
import apiMiddlewareHelper from "../../../../service/api";
import { DashboardService } from "../../../../service/thread.service/dashboard.service";

const dashBoardRouter = new Router();

dashBoardRouter.get("/", DashboardService.getDashboard);
dashBoardRouter.get("/:id", apiMiddlewareHelper.validateUUIDMiddleware, ctx => {
   ctx.body = "return target dashboard";
});
dashBoardRouter.post("/", DashboardService.createPostDashboard);

dashBoardRouter.put("/:id", apiMiddlewareHelper.validateUUIDMiddleware, ctx => {
   ctx.body = "update by id";
});
dashBoardRouter.del("/:id", apiMiddlewareHelper.validateUUIDMiddleware, ctx => {
   ctx.body = " delete by id";
});

export { dashBoardRouter };
