import Router from "koa-router";

import { FacebookPageService, routeServie as api } from "service";

const pageRouter = new Router();

pageRouter.get("/", FacebookPageService.allFacebookPagesEndPoint);
pageRouter.get("/:id", api.validateUUIDMiddleware, FacebookPageService.targetFacebookPagesEndPoint);
pageRouter.post("/", FacebookPageService.facebookPageConnectEndPoint);
pageRouter.del("/:id", api.validateUUIDMiddleware, FacebookPageService.facebookPageDisconnectEndPoint);

export { pageRouter };
