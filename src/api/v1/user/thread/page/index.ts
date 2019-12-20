import Router from "koa-router";
import { IContext, IThreadState } from "../../../../../interfaces";
const pageRouter = new Router();

import { pageRouter as facebookRouter } from "./facebook";
import { pageRouter as instagramRouter } from "./instagram";
pageRouter.use("/facebook", facebookRouter.routes());
pageRouter.use("/instagram", instagramRouter.routes());
pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
  ctx.body = "return all pages for current thread";
});

export { pageRouter };
