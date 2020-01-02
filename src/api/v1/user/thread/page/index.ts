import Router from "koa-router";
import { IContext, IThreadState } from "../../../../../types";
const pageRouter = new Router();

import { pageRouter as facebookRouter } from "./facebook";
import { pageRouter as instagramRouter } from "./instagram";
import { Page } from "../../../../../models";
import { Repository, getManager } from "typeorm";

pageRouter.use("/facebook", facebookRouter.routes());
pageRouter.use("/instagram", instagramRouter.routes());
pageRouter.get("/", async (ctx: IContext<IThreadState>) => {
   const thread = ctx.state.thread;
   const pageRepository: Repository<Page> = getManager().getRepository(Page);
   const pages = await pageRepository.find({ thread: thread });
   ctx.body = pages;
});

export { pageRouter };
