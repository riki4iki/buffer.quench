import { IContext, IPostState, IParamContext, IParamIdState } from "../../types";
import { add, update, del } from "./executer";

export default class cronController {
   public static async tasksEndPoint(ctx: IContext<IPostState>) {}
   public static async taskEndPoint(ctx: IParamContext<IPostState, IParamIdState>) {}
   public static async taskCreateEndPoint(ctx: IContext<IPostState>) {
      try {
         const task = await add(ctx.state.post);
         ctx.status = 201;
         ctx.body = ctx.state.post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async taskUpdateEndPoint(ctx: IParamContext<IPostState, IParamIdState>) {
      try {
         const updated = await update(ctx.state.post);
         ctx.status = 200;
         ctx.body = ctx.state.post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   public static async taskDeleteEndPoint(ctx: IParamContext<IPostState, IParamIdState>) {
      try {
         const deleted = await del(ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
