import { IContext, IAuthState } from "../../types";
import { Next } from "koa";
import { Unauthorized } from "http-errors";
import { get, create, del, update } from "./crud";
import { omit } from "lodash";

export default class UserService {
   //#region endPoints
   /**
    * EndPoint - Get user from current session that decoded from jwt access token in headers
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async userEndPoint(ctx: IContext<IAuthState>) {
      const user = ctx.state.user;
      ctx.status = 200;
      ctx.body = await user.withSocials();
   }
   /**
    * EndPoint - Create new user in system and save in database. Return created user without password
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async createEndPoint(ctx: IContext<IAuthState>) {
      try {
         const created = await create({ email: ctx.request.body.email, password: ctx.request.body.password });
         ctx.status = 201;
         ctx.body = omit(created, "password");
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoints - update current user by access token from headers
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async updateEndPoint(ctx: IContext<IAuthState>) {
      try {
         if (!ctx.state.session) {
            const err = new Unauthorized("session doesn't exist");
            throw err;
         } else {
            const updated = await update(ctx.state.session, { email: ctx.request.body.email, password: ctx.request.body.password });
            ctx.status = 200;
            ctx.body = omit(updated, "password");
         }
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - Delete current user from system
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async deleteEndPoint(ctx: IContext<IAuthState>) {
      try {
         if (!ctx.state.session) {
            const err = new Unauthorized("session doesn't exist");
            throw err;
         } else {
            await del(ctx.state.session);
            ctx.status = 204;
         }
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion ednPoints
   //#region middlewares
   /**
    * Middleware - Create user by input body(email/password), after save in ctx.state.user for next middlewares
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async createMiddleware(ctx: IContext<IAuthState>, next: Next) {
      try {
         const created = await create({ email: ctx.request.body.email, password: ctx.request.body.password });
         ctx.state.user = created;

         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * Middleware - Getting user by current session from jwt access token in headers
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async currentUserMiddleware(ctx: IContext<IAuthState>, next: Next) {
      try {
         if (!ctx.state.session) {
            const err = new Unauthorized("session doesn't exist");
         } else {
            const user = await get(ctx.state.session);
            ctx.state.user = user;
            await next();
         }
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion middlewares
}
