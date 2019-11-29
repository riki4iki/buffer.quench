import Router from "koa-router";
import { Context, Next } from "koa";
import { Repository, getManager } from "typeorm";
import { HmacSHA1 } from "crypto-js";
import { ValidationError, validate } from "class-validator";
import User from "../../../models/user";
import jwt from "../../../lib/jwt";

const router = new Router();
router.post("/sign-in", async (ctx: Context, next: Next) => {
  //require email/password for auth, must return jwt object
  const login = ctx.request.body.email;
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
    const pair = await jwt.createPair(user.id);
    ctx.status = 200;
    ctx.body = pair;
  }
});

router.post("/sign-up", async (ctx: Context, next: Next) => {
  //create new user in system
  const userRepository: Repository<User> = getManager().getRepository(User);

  const targetUser: User = new User(); //create new entity

  targetUser.email = ctx.request.body.email;
  targetUser.password = ctx.request.body.password;

  const errors: ValidationError[] = await validate(targetUser); //validate

  if (errors.length > 0) {
    //if error exist
    ctx.status = 400;
    ctx.body = errors;
  } else if (await userRepository.findOne({ email: targetUser.email })) {
    //if user with email exist (email must be unique)
    ctx.status = 400;
    ctx.body = "email already exist";
  } else {
    //0 errors, new email
    //hash password, save in database
    targetUser.password = HmacSHA1(
      ctx.request.body.password,
      process.env.hash_key
    ).toString();
    const user = await userRepository.save(targetUser);
    const pair = await jwt.createPair(user.id);
    ctx.status = 201;
    ctx.body = pair;
  }
  await next();
});

export = router;
