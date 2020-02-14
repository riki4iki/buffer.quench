import Router from "koa-router";

import { routeServie as api, legendService as controller } from "service";

const legendRouter = new Router();

legendRouter.get("/", controller.legendsEndPoint);
legendRouter.get("/:id", api.validateUUIDMiddleware, controller.legendEndPoint);

export { legendRouter };
