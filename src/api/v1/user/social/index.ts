import Router from "koa-router";

import { SocialService } from "service";

const social = new Router();

import { fbRouter } from "./facebook";

social.use("/facebook", fbRouter.routes());

social.get("/", SocialService.socialsEndPoint);

export { social };
