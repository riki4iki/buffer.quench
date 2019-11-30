import { Next, Context } from "koa";
import jwt from "./jwt";
export default class AuthService {
  public static async checkSession(ctx: Context, next: Next) {
    const access = ctx.headers.access_token;
    const payload = await jwt
      .payload(access)
      .catch(err => ctx.app.emit("error", err, ctx));
    ctx.state.session = payload.id;
    await next();
  }
}
