import { Context, Next } from "koa";

const setCookiesHeader = async (ctx: Context, next: Next) => {
   ctx.set("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
   await next();
};

const setHeadersMiddleware = () => setCookiesHeader;

export { setHeadersMiddleware };
