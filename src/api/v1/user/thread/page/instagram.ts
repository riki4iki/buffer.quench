import Router from "koa-router";
import { IContext, IThreadState } from "../../../../../types";
const pageRouter = new Router();

pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
   ctx.body = "instagram page...";
});

export { pageRouter };
