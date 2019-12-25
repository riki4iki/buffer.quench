import Router from "koa-router";
import {
  postService as controller,
  routeServie as routes,
  cronService as tasks
} from "../../../../../service";
const postRouter = new Router();

postRouter.get("/", controller.postsEndPoint);
postRouter.get("/:id", routes.validateUUIDMiddleware, controller.postEndPoint);
postRouter.post("/", controller.postCreateMiddleware, tasks.taskCreateEndPoint);
postRouter.put(
  "/:id",
  routes.validateUUIDMiddleware,
  controller.postUpdateMiddleware,
  tasks.taskUpdateEndPoint
);
postRouter.del(
  "/:id",
  routes.validateUUIDMiddleware,
  controller.postDeleteMiddleware,
  tasks.taskDeleteEndPoint
);

export { postRouter };
