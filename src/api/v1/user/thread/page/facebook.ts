import Router from "koa-router";
const pageRouter = new Router();
import { FacebookPageService, routeServie as api } from "../../../../../service";

pageRouter.get("/", FacebookPageService.allFacebookPagesEndPoint);
pageRouter.get("/:id", api.validateUUIDMiddleware, FacebookPageService.targetFacebookPagesEndPoint);
pageRouter.post("/", FacebookPageService.facebookPageConnectEndPoint);
pageRouter.del("/:id", FacebookPageService.facebookPageDisconnectEndPoint);

export { pageRouter };
