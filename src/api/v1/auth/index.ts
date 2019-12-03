import { Context, Next } from "koa";
import Router from "koa-router";
import { jwtService } from "../../../lib";
import { Refresh } from "../../../models";
import { Repository, getManager } from "typeorm";
const router = new Router();

const localAuthenticate: Router = require("./localAuth");
const facebookAuthenticate: Router = require("./fbAuth");

router
  .use("/localAuth", localAuthenticate.routes())
  .use("/fbAuth", facebookAuthenticate.routes());

router.get("/", async (ctx: Context, next: Next) => {
  //unused route
  ctx.status = 306;
  await next();
});
router.post("/refresh", async (ctx: Context) => {
  const input = ctx.headers["refresh_token"]; //refresh token stored in headers
  const inputPayload = await jwtService //get object from jwt
    .payload(input)
    .catch(err => ctx.app.emit("error", err, ctx));

  const refreshRepository: Repository<Refresh> = getManager().getRepository(
    // get reresh tokens repository
    Refresh
  );
  const db = await refreshRepository.findOne({
    // find session in db
    where: { user: inputPayload.id }
  });

  const dbPayload = await jwtService // get object from db token
    .payload(db.token)
    .catch(err =>
      ctx.app.emit(
        "error",
        { status: 401, message: "invalid jwt in database" },
        ctx
      )
    );
  if (!(JSON.stringify(inputPayload) === JSON.stringify(dbPayload))) {
    //objects can be equled by JSON.stringify
    ctx.status = 400;
    ctx.body = "invalid refresh token";
  } else {
    const newPair = await jwtService.createPair(inputPayload.id);
    ctx.body = newPair;
  }
});

export = router;
