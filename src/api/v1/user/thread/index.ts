import Router from "koa-router";
import { routeServie } from "../../../../service";
import { threadService as controller } from "../../../../service";

import { postRouter } from "./post";
import { pageRouter } from "./page";
import { legendRouter } from "./legend";
const threadRouter = new Router();

threadRouter.use(
  "/:id/legend",
  routeServie.validateUUIDMiddleware,
  controller.threadMiddleware,
  legendRouter.routes()
);

threadRouter.use(
  "/:id/post",
  routeServie.validateUUIDMiddleware,
  controller.threadMiddleware,
  postRouter.routes()
);

threadRouter.use(
  "/:id/page",
  routeServie.validateUUIDMiddleware,
  controller.threadMiddleware,
  pageRouter.routes()
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
