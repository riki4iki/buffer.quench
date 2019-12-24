import Router from "koa-router";
import {
  postService as controller,
  routeServie as routes
} from "../../../../../service";
const postRouter = new Router();
postRouter.get("/qwe", ctx => {
  ctx.app.emit("cron-update", {});
});
postRouter.get("/", controller.postsEndPoint);
postRouter.get("/:id", routes.validateUUIDMiddleware, controller.postEndPoint);
postRouter.post("/", controller.postCreateEndPoint);
postRouter.put(
  "/:id",
  routes.validateUUIDMiddleware,
  controller.postUpdateEndPoint
);
postRouter.del(
  "/:id",
  routes.validateUUIDMiddleware,
  controller.postDeleteEndPoint
);

export { postRouter };
