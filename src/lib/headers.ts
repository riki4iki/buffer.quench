import { Context, Next } from "koa";

export async function setHeaders(ctx: Context, next: Next) {
   ctx.set("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
   await next();
}
