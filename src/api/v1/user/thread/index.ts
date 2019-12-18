import Router from "koa-router";
import { IAuthContext } from "src/interfaces";
import { routeServie } from "../../../../service";
const thread = new Router();

thread.get("/", async (ctx: IAuthContext) => {
  ctx.body = "return all threads";
});

thread.get(
  "/:id",
  routeServie.validateUUIDMiddleware,
  async (ctx: IAuthContext) => {
    ctx.body = `return thread with id: ${ctx.params.id}`;
  }
);

thread.del(
  "/:id",
  routeServie.validateUUIDMiddleware,
  async (ctx: IAuthContext) => {
    ctx.body = `delete thread with id: ${ctx.params.id}`;
  }
);
thread.post("/", async (ctx: IAuthContext) => {
  ctx.body = "create new thread";
});

export { thread };
