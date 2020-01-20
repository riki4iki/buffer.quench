import { IContext, IParamContext, IParamIdState, IThreadState } from "../../../types";
import { all, get } from "./crud";
/**
 * Class - Controller for legend posts logic
 */
export default class LegendService {
   /**
    * EndPoint - return target legend by id from database
    * @param ctx Context - Koa Context that contain Upgrated state with thread that implement IAuthState interface
    */
   public static async legendEndPoint(ctx: IParamContext<IThreadState, IParamIdState>) {
      try {
         const history = await get(ctx.state.thread, ctx.params.id);
         ctx.status = 200;
         ctx.body = history;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - return all legends for current thread in array
    * @param ctx Context - Koa Context that contain Upgrated state with thread that implement IAuthState interface
    */
   public static async legendsEndPoint(ctx: IContext<IThreadState>) {
      try {
         const histories = await all(ctx.state.thread);
         ctx.status = 200;
         ctx.body = histories;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
