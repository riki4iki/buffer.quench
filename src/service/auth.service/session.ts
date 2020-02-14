import { Next } from "koa";

import { IContext, IAuthState } from "types";
import { jwtService as jwt } from "lib";
/**
 * Class controller implement logic creating session
 */
export default class SessionService {
   /**
    * Middleware for checking input access token, decode this, save to Context.state.session.
    * Important for detect current user
    * identify loged user by jsonwebtoken access token in headers
    * @param ctx IAuthContext - modernized context for current api, that have state with user: <User> and session: string
    * @param next Next - koa Next function wich reliazed connection mechanics
    */
   public static async checkSession(ctx: IContext<IAuthState>, next: Next) {
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
