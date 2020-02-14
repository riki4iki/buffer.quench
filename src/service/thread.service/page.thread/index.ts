import { IContext, IThreadState } from "types";

import { all } from "./crud";
import { FacebookPageService } from "./facebook.page";
/**
 * Controller works with all connected pages
 */
class PageService {
   /**
    * EndPoint - get all connection for current thread in router /thread/:id/page - GET. Array contains socialId and type of social
    * @param ctx Context - koa context with state IThreadState that contains thread instance
    */
   public static async pagesEndPoint(ctx: IContext<IThreadState>) {
      try {
         const connectedPages = await all(ctx.state.thread);
         ctx.status = 200;
         ctx.body = connectedPages;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
export { PageService, FacebookPageService };
