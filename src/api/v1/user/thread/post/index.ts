import Router from "koa-router";
import { IContext, IPostState } from "../../../../../interfaces";
import { routeServie as routes } from "../../../../../service";
const postRouter = new Router();

postRouter.get("/", async (ctx: IContext<IPostState>) => {
  ctx.body = " all posts current user thread";
});
postRouter.get(
  "/:id",
  routes.validateUUIDMiddleware,
  async (ctx: IContext<IPostState>) => {
    ctx.body = "target post with id: " + ctx.params.id;
  }
);
postRouter.post("/", async (ctx: IContext<IPostState>) => {
  ctx.body = "create new post";
});
postRouter.put(
  "/:id",
  routes.validateUUIDMiddleware,
  async (ctx: IContext<IPostState>) => {
    ctx.body = "update target post ";
  }
);
postRouter.del(
  "/:id",
  routes.validateUUIDMiddleware,
  async (ctx: IContext<IPostState>) => {
    ctx.body = "delete target post";
  }
);
export { postRouter };
