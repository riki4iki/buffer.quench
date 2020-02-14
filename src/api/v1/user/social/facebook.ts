import Router from "koa-router";

import { routeServie as api, facebookSocialService as controller } from "service";

const fbRouter = new Router();

fbRouter.get("/", controller.facebookUsersEndPoint);
fbRouter.post("/", controller.facebookUserConnectEndPoint);
fbRouter.get("/:id/page", api.validateUUIDMiddleware, controller.facebookUserByIdMiddleware, controller.facebookPageGettingEndPoint);
fbRouter.get("/:id", api.validateUUIDMiddleware, controller.facebookUserByIdEndPoint);
fbRouter.del("/:id", api.validateUUIDMiddleware, controller.facebookUserDisconnectEndPoint);
export { fbRouter };
