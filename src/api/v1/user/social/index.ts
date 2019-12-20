import { Context } from "koa";
import Router from "koa-router";
const social = new Router();

import { fbRouter } from "./facebook";

social.use("/facebook", fbRouter.routes());

social.get("/", async (ctx: Context) => {
  //here need return all social account for current user
  //problem: we have many types : facebook, instagram, twiter...

  //CURRENT VERSION FOR FACEBOOK ONLY, idk how to write now for full with all social networks(insta, twitter e.t.c)

  ctx.body = "return all social";
});

export { social };
