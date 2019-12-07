import { Next, Context } from "koa";
import jwt from "./jwt";
import { IPayload } from "../typescript";

export default class AuthService {
  public static async checkSession(ctx: Context, next: Next) {
    const access: string = ctx.headers.access_token;
    try {
      const payload = await jwt.payload(access);
      ctx.state.session = payload.id;
      console.log(payload);
      console.log(ctx.state);
      await next();
    } catch (err) {
      ctx.app.emit("error", err, ctx);
    }
  }
}
