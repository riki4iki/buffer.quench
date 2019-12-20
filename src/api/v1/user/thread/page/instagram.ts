import Router from "koa-router";
import { IContext, IThreadState } from "../../../../../interfaces";
const pageRouter = new Router();

pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
  ctx.body = "return instagram pages";
});

export { pageRouter };
