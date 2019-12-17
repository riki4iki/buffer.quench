import { Next, Context } from "koa";
import jwt from "../lib/jwt";
import { IAuthContext } from "../typescript";
/**
 * Class with middlewares for authenticate requests, create sessions, permisions e.t.c.
 */
export default class AuthService {
  /**
   * Middleware for checking input access token, decode this, save to Context.state.session.
   * Important for detect current user
   * @param ctx IAuthContext - modernized context for current api, that have state with user: <User> and session: string
   * @param next Next - koa Next function wich reliazed connection mechanics
   */
  public static async checkSession(ctx: IAuthContext, next: Next) {
    const access: string = ctx.headers.access_token;
    try {
      const payload = await jwt.payload(access);
      ctx.state.session = payload.id;
      await next();
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
}
