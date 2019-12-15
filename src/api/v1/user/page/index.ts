import Router from "koa-router";
const accounts = new Router();

const facebookAccounts: Router = require("./facebook");

accounts.get("/", async (ctx, next) => {
  ctx.body = "return all accounts";
});

accounts.use("/facebook", facebookAccounts.routes());

export = accounts;
