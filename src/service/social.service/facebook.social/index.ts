import { IContext, IAuthState, IParamContext, IParamIdState, IFaceBookState } from "../../../types";
import { all, add, del, get } from "./crud";
import { insertPagesfromApi } from "./page";
import { Next } from "koa";
/**
 * Class Controller for facebook soical routers. Getting all connected socials, target by id, add new disconnect
 */
export default class FacebookSocialService {
   /**
    * EndPoint - return all connected facebook social for current user in route /user/social/facebook - GET
    * @param ctx Context - koa context with IAuthState that contains current user and current session, decoded from jwt access token in headers
    */
   public static async facebookUsersEndPoint(ctx: IContext<IAuthState>) {
      const connectedFacebookSocials = await all(ctx.state.user);
      ctx.status = 200;
      ctx.body = connectedFacebookSocials;
   }
   /**
    *EndPint - return target connected facebook social from database
    * @param ctx Context - koa context with ctx.state:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState contains param.id from URL string /facebook/:id
    */
   public static async facebookUserByIdEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         const targetSocial = await get(ctx.state.user, ctx.params.id);
         ctx.status = 200;
         ctx.body = await targetSocial.toResponse();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint - Connect facebook social account to current system user by input short access token, return created facebook social
    * @param ctx Context - koa context with IAuthState that contains current user and current session, decoded from jwt access token in headers
    */
   public static async facebookUserConnectEndPoint(ctx: IContext<IAuthState>) {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const user_access_token_2h = ctx.request.body.token;
      try {
         const social = await add(ctx.state.user, user_access_token_2h);
         ctx.status = 201;
         const toSocial = await social.toResponse();
         console.log(toSocial);
         ctx.body = toSocial;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint - Delete facebook social from database to current user
    * @param ctx Context - koa context with ctx.state:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState contains param.id from URL string /facebook/:id
    */
   public static async facebookUserDisconnectEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         await del(ctx.state.user, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   /**
    *Middleware. Getting connected facebook social from database for current user and save in ctx.state.social
    * @param ctx Context - koa context with ctx.state:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState contains param.id from URL string /facebook/:id
    * @param next Next - connect mechanism for next middleware chain
    */
   public static async facebookUserByIdMiddleware(ctx: IParamContext<IFaceBookState, IParamIdState>, next: Next) {
      try {
         const facebookUser = await get(ctx.state.user, ctx.params.id);
         ctx.state.social = facebookUser;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint. Getting all facebook pages/accounts from facebook api -> generate long accesstoken -> save in database -> return to response
    * @param ctx Context - koa context with IFacebookState with facebook User instanse in ctx.state.social for gettibg
    * facebook pages/account
    */
   public static async facebookPageGettingEndPoint(ctx: IContext<IFaceBookState>) {
      try {
         const pages = await insertPagesfromApi(ctx.state.social);
         ctx.status = 200;
         ctx.body = pages;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
