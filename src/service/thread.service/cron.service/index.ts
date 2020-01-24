import { IContext, IPostState, IParamContext, IParamIdState } from "../../../types";
import { NodeScheduleExecuter } from "./node-shedule/executer";

const executer = new NodeScheduleExecuter();
/**
 * Controller work with iterior state
 */
export default class cronController {
   /**
    * EndPoint. Add to cron tasks new task for new post from ctx.state.post, return post to response
    * @param ctx Context - Koa context with IPostState that contain post instanse from previos middleware
    */
   public static async taskCreateEndPoint(ctx: IContext<IPostState>) {
      try {
         //create new task
         const task = await executer.create(ctx.state.post);
         ctx.status = 201;
         //retrun same post
         ctx.body = ctx.state.post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint. Update task in server cron state. Updata available only for date. Return updated post
    * @param ctx Context - Koa context IParamContext with post instanse and id resource from URL
    */
   public static async taskUpdateEndPoint(ctx: IParamContext<IPostState, IParamIdState>) {
      try {
         const updated = await executer.update(ctx.state.post);
         ctx.status = 200;
         ctx.body = ctx.state.post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *EndPoint. Delete task from server state by input post id;
    * @param ctx Context - Koa context IParamContext with post instanse and id resource from URL
    */
   public static async taskDeleteEndPoint(ctx: IParamContext<IPostState, IParamIdState>) {
      try {
         const deleted = await executer.del(ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
