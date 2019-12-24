import { Context, Next } from "koa";
import { getManager, Repository, Not, Equal } from "typeorm";
import { validate, ValidationError } from "class-validator";
import { HmacSHA1 } from "crypto-js";
import { omit } from "lodash";

import User from "../models/user";
import { IAuthContext } from "types";

/**
 * Controller that works with user entity. Have endpoints, middlewares for user updating, creating, getting, deleting
 */
export default class UserService {
  /**
   * Find current user in database and save in ctx.state.user. requered ctx.state.session.Use this if user has been authenticated
   * @param ctx - Koa Context, here must be stored session(in ctx.state) and here will store user(in ctx.state)
   * @param next - Koa Next, use for next chain target
   */
  public static async getCurrentUserMiddleware(ctx: IAuthContext, next: Next) {
    if (!ctx.state.session) {
      ctx.app.emit("error", { status: 401, message: "session is null" }, ctx);
    } else {
      const id = ctx.state.session;
      const userRepository: Repository<User> = getManager().getRepository(User);
      const user = await userRepository.findOne(id);
      if (!user) {
        ctx.app.emit("error", { status: 204 }, ctx); // No users with that session
      } else {
        ctx.state.user = user;
        await next();
      }
    }
  }
  //for future, now it's empty cause useless
  /**
   * EMPTY. MIDDLEWARE FOR FUTURE!!
   * @param ctx
   * @param next
   */
  public static async getAllUsersMiddleware(ctx: Context, next: Next) {}
  /**
   * EMPTY  MIDDLEWARE FOR FUTURE!!
   * @param ctx
   * @param next
   */
  public static async createUserMiddleware(ctx: Context, next: Next) {}
  /**
   * EMPTY  MIDDLEWARE FOR FUTURE!!
   * @param ctx
   * @param next
   */
  public static async updateUserMiddleware(ctx: Context, next: Next) {}
  /**
   * EMPTY  MIDDLEWARE FOR FUTURE!!
   * @param ctx
   * @param next
   */
  public static async deleteUserMiddleware(ctx: Context, next: Next) {}

  /**
   * Create a new user and save in ctx.state - use this like middleware
   * @param ctx - Koa Context
   * @param next - Koa Next
   */
  public static async createNewUserMiddleware(ctx: Context, next: Next) {
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
      ctx.state.user = user;
      await next();
    }
  }
  //middle for routes /user
  /**
   * Return user from ctx.state. Use this if user has been authenticated
   * @param ctx - Koa Context
   */
  public static async getCurrentUserEndPoint(ctx: Context) {
    const user = omit(ctx.state.user, "password"); // ctx.user - user from lib/auth middleware

    ctx.status = 200;
    ctx.body = user;
  }
  /**
   * Update current user, after, will redirect to /user/. Use this if user has been authenticated.
   * @param ctx - Koa Context
   */
  public static async updateCurrnetUserEndPoint(ctx: Context): Promise<void> {
    const prevUser: User = ctx.state.user;

    const userRepository: Repository<User> = getManager().getRepository(User);
    const nextUser: User = new User();
    nextUser.id = prevUser.id;
    nextUser.email = ctx.request.body.email;
    nextUser.password = ctx.request.body.password;

    const errors: ValidationError[] = await validate(nextUser);

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = errors;
    } else if (!(await userRepository.findOne(nextUser.id))) {
      ctx.status = 400;
      ctx.body = "user dont exist";
    } else if (
      await userRepository.findOne({
        id: Not(Equal(nextUser.id)),
        email: nextUser.email
      })
    ) {
      ctx.status = 400;
      ctx.body = "email already exist";
    } else {
      nextUser.password = HmacSHA1(
        nextUser.password,
        process.env.hash_key
      ).toString();
      const user = await userRepository.save(nextUser);
      ctx.redirect("/api/v1/user");
    }
  }
  /**
   * Delete current user from ctx.state. Use this if user has been authenticated.
   * @param ctx - Koa Context
   */
  public static async deleteCurrentUserEndPoint(ctx: Context) {
    const userToDestroy = ctx.state.user;
    const userRepository: Repository<User> = getManager().getRepository(User);
    await userRepository.remove(userToDestroy);
    ctx.status = 204;
  }
}
