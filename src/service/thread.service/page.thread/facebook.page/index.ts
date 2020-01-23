import { IContext, IThreadState, IParamContext, IParamIdState } from "../../../../types";
import { all, target, disconnect, connectArrayPages } from "./crud";
import { BadRequest } from "http-errors";
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
         const array = await bodyToArray(ctx.request.body.pages);
         const connected = await connectArrayPages(ctx.state.user, ctx.state.thread, ctx.request.body.socialId, array);
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
         const removed = await disconnect(ctx.state.thread, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}

/**
 *Promise - return parsed array with page id's
 * @param str String - input string from ctx.request.body.pages that present page array for connection to thread from precious middleware
 */
async function bodyToArray(str: string): Promise<Array<string>> {
   try {
      const pagesString: string = str.replace(/'/g, '"');
      const pagesIdArray: Array<string> = JSON.parse(pagesString);
      return pagesIdArray;
   } catch (err) {
      const badRequest = new BadRequest(`input pages array exception: ${err.message}`);
      throw badRequest;
   }
}
