import Router from "koa-router";
import { routeServie } from "../../../../service";
import { threadService as controller } from "../../../../service";

import { postRouter } from "./post";

const threadRouter = new Router();

threadRouter.use(
  "/:id/post",
  routeServie.validateUUIDMiddleware,
  controller.threadMiddleware,
  postRouter.routes()
);

threadRouter.get("/", controller.threadsEndPoint);

threadRouter.get(
  "/:id",
  routeServie.validateUUIDMiddleware,
  controller.threadEndPoint
);

threadRouter.del(
  "/:id",
  routeServie.validateUUIDMiddleware,
  controller.threadDeleteEndPoint
);
threadRouter.put(
  "/:id",
  routeServie.validateUUIDMiddleware,
  controller.threadUpdateEndPoint
);
threadRouter.post("/", controller.threadCreateEndPoint);

export { threadRouter };
