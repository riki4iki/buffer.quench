import Router from "koa-router";
const pageRouter = new Router();
import { IContext, IThreadState } from "../../../../../interfaces";
pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
  ctx.body = "facebook pages for current thread";
});
pageRouter.post("/", async (ctx: IContext<IThreadState>) => {
  ctx.body = "add page for threads";
});

export { pageRouter };
