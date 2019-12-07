import Router from "koa-router";
import { Context, Next } from "koa";
import { Repository, getManager } from "typeorm";
import { HmacSHA1 } from "crypto-js";
import { userLogic } from "../../../service";
import { User, Refresh, FacebookUser } from "../../../models";
import { jwtService as jwt } from "../../../lib";

const router = new Router();
router.post("/sign-in", async (ctx: Context, next: Next) => {
  //require email/password for auth, must return jwt object
  const login: string = ctx.request.body.email;
  const password = HmacSHA1(
    ctx.request.body.password,
    process.env.hash_key
  ).toString();
  const userRepository: Repository<User> = getManager().getRepository(User);
  const user: User = await userRepository.findOne({ email: login });
  if (!user) {
    ctx.status = 401;
    ctx.body = "invalid email, user does not exist";
  } else if (!(user.password === password)) {
    ctx.status = 401;
    ctx.body = "invalid password";
  } else {
    const pair = await jwt.createPair(user);
    ctx.status = 200;
    ctx.body = pair;
  }
});

router.post(
  "/sign-up",
  userLogic.createNewUserMiddleware,
  async (ctx: Context) => {
    const user: User = ctx.state.user;
    const pair = await jwt.createPair(user);
    ctx.status = 201;
    ctx.body = pair;
  }
);

export = router;
