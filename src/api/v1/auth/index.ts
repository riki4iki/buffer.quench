import { Context, Next } from "koa";
import Router from "koa-router";
import { jwtService } from "../../../lib";
import { Refresh, User } from "../../../models";
import { Repository, getManager, getRepository } from "typeorm";
import { IPayload } from "interfaces";
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
  try {
    const inputPayload: IPayload = await jwtService //get object from jwt
      .payload(input);

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
      await refreshRepository.remove(db);
    } else {
      const userRepository: Repository<User> = getManager().getRepository(User);
      const user: User = await userRepository.findOne(inputPayload.id);
      const newPair = await jwtService.createPair(user);
      ctx.body = newPair;
    }
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
});

export = router;
