import { IContext, IThreadState, IParamContext, IParamIdState } from "types";
import { all, target, disconnect, connectArrayPages } from "./crud";
import apiValidator from "service/api";
import { get as findFacebookSocial } from "service/social.service/facebook.social/crud";
/**
 * Controller that work with getting, connectinm disonnecting facebook pages to threads by id
 */
export class FacebookPageService {
   /**
    * EndPoint - function for getting all connceted facebook pages from current thread from previous middleware
    * @param ctx Context - Koa contextx with extends state IThreadState that contain thread instanse from previous middleware
    */
   public static async allFacebookPagesEndPoint(ctx: IContext<IThreadState>) {
      try {
         const connectedFacebookPages = await all(ctx.state.thread);
         ctx.status = 200;
         ctx.body = connectedFacebookPages;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint. return target connected facebook page by identifier
    * @param ctx Context - Koa context that contain state IThreadState with thread instanse and IParamIdState with id from URL
    */
   public static async targetFacebookPagesEndPoint(ctx: IParamContext<IThreadState, IParamIdState>) {
      try {
         const connectedPage = await target(ctx.state.thread, ctx.params.id);
         ctx.status = 200;
         ctx.body = connectedPage;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint - connect pages from input array (Array<string>) to current thread
    * @param ctx Context - Koa contextx with extends state IThreadState that contain thread instanse from previous middleware
    */
   public static async facebookPageConnectEndPoint(ctx: IContext<IThreadState>) {
      try {
         //need validate input array and social id...

         console.log(ctx.request.body.pages);
         const socialId = await apiValidator.validateUUID(ctx.request.body.socialId, "socialId");
         const facebookSocial = await findFacebookSocial(ctx.state.user, socialId);
         const array = await apiValidator.StringToArray(ctx.request.body.pages);
         const connected = await connectArrayPages(ctx.state.thread, facebookSocial, array);
         ctx.status = 201;
         ctx.body = connected;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint - Disconnect target page from thread
    * @param ctx Context - Koa contextx with extends state IThreadState that contain thread instanse from previous middleware
    */
   public static async facebookPageDisconnectEndPoint(ctx: IParamContext<IThreadState, IParamIdState>) {
      try {
         await disconnect(ctx.state.thread, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
