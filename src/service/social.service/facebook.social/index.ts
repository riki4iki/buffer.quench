import { IContext, IAuthState, IParamContext, IParamIdState, IFaceBookState } from "../../../types";
import { all, add, del, get } from "./crud";
import { insertPagesfromApi } from "./page";
import { Next } from "koa";
/**
 * Class Controller for facebook soical routers. Getting all connected socials, target by id, add new disconnect
 */
export default class FacebookSocialService {
   public static async facebookUsersEndPoint(ctx: IContext<IAuthState>) {
      try {
         const connectedFacebookSocials = await all(ctx.state.user);
         ctx.status = 200;
         ctx.body = connectedFacebookSocials;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async facebookUserByIdEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         const targetSocial = await get(ctx.state.user, ctx.params.id);
         ctx.status = 200;
         ctx.body = await targetSocial.toResponse();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async facebookUserConnectEndPoint(ctx: IContext<IAuthState>) {
      const user_access_token_2h = ctx.request.body.token;
      try {
         const social = await add(ctx.state.user, user_access_token_2h);
         ctx.status = 201;
         ctx.body = await social.toResponse();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async facebookUserDisconnectEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         await del(ctx.state.user, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   public static async facebookUserByIdMiddleware(ctx: IParamContext<IFaceBookState, IParamIdState>, next: Next) {
      try {
         const facebookUser = await get(ctx.state.user, ctx.params.id);
         ctx.state.social = facebookUser;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   public static async facebookPageGettingEndPoint(ctx: IParamContext<IFaceBookState, IParamIdState>) {
      try {
         const pages = await insertPagesfromApi(ctx.state.social);
         ctx.status = 200;
         ctx.body = pages;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
