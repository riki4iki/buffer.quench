import { Context } from "koa";
import Router from "koa-router";
const facebookRouter = new Router();

import { FbUser } from "../../../../models";
import { Repository, getManager } from "typeorm";
import { fbService } from "../../../../lib";

facebookRouter.get("/", async (ctx: Context) => {
  ctx.body = "return all facebook routers";
});

facebookRouter.get("/:id", async (ctx: Context) => {
  ctx.body = "return target account";
});

facebookRouter.post("/", async (ctx: Context) => {
  const fbUserRepository: Repository<FbUser> = getManager().getRepository(
    FbUser
  );
  const number = 123131213;
  ctx.body = number * number;
});
facebookRouter.delete("/", async (ctx: Context) => {
  ctx.body = "remove facebook account from current user";
});
export = facebookRouter;
