import Router from "koa-router";
import { Context, Next } from "koa";
import { Repository, getManager } from "typeorm";
import { HmacSHA1 } from "crypto-js";
import { userLogic } from "../../../service";
import { User } from "../../../models";
import { jwtService as jwt } from "../../../lib";

const router = new Router();
router.post("/sign-in", async (ctx: Context, next: Next) => {
   //require email/password for auth, must return jwt object
   const login: string = ctx.request.body.email;
   const userRepository: Repository<User> = getManager().getRepository(User);
   const user: User = await userRepository.findOne({ email: login });
   if (!user) {
      ctx.status = 401;
      ctx.body = "invalid email, user does not exist";
   } else if (!(await user.checkPassword(ctx.request.body.password))) {
      ctx.status = 401;
      ctx.body = "invalid password";
   } else {
      const pair = await jwt.createPair(user);
      ctx.status = 200;
      ctx.body = pair;
   }
});

router.post("/sign-up", userLogic.createMiddleware, async (ctx: Context) => {
   const user: User = ctx.state.user;
   const pair = await jwt.createPair(user);
   ctx.status = 201;
   ctx.body = pair;
});

export { router };
