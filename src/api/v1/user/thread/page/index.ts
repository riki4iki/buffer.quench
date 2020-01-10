import Router from "koa-router";
import { PageService } from "../../../../../service";
const pageRouter = new Router();

import { pageRouter as facebookRouter } from "./facebook";
import { pageRouter as instagramRouter } from "./instagram";

pageRouter.use("/facebook", facebookRouter.routes());
pageRouter.use("/instagram", instagramRouter.routes());
pageRouter.get("/", PageService.pagesEndPoint);

export { pageRouter };
