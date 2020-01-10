import { IContext, IThreadState, IAuthState, IParamContext, IParamIdState } from "../../types";
import { all, create, get, update, del } from "./crud";
import { Next } from "koa";
export * from "./page.thread";

/**
 * Class controller for path /user/thread. public static method for CRUD - GET, POST, UPDATE, DELETE
 */
export class ThreadService {
   //#region endpoints
   /**
    * EndPoint - return target thread by id. use for GET method
    * @param ctx Context - Koa Context with states:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState for getting id from url string ...thread/:id
    */
   public static async threadEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         const thread = await get(ctx.state.user, ctx.params.id);
         ctx.status = 200;
         ctx.body = thread;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - return all current user threads. Get method
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async threadsEndPoint(ctx: IContext<IAuthState>) {
      try {
         const threads = await all(ctx.state.user);
         ctx.status = 200;
         ctx.body = threads;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - create new thread for currnet user by input name. Return created new thread models. POST method
    * @param ctx Context - Koa Context with state IAuthState that contain current user and session
    */
   public static async createThreadEndPoint(ctx: IContext<IAuthState>) {
      try {
         const created = await create(ctx.state.user, { name: ctx.request.body.name });
         ctx.status = 201;
         ctx.body = created;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - update target thread by input name in body. Return updated thread, PUT method
    * @param ctx Context - Koa Context with states:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState for getting id from url string ...thread/:id
    */
   public static async updateThreadEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         const updated = await update(ctx.state.user, ctx.params.id, { name: ctx.request.body.name });
         ctx.status = 200;
         ctx.body = updated;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - delete target thread by id for current user. Return 204 status. DELETE method
    * @param ctx Context - Koa Context with states:
    * - IAuthState that contains current user and current session, decoded from jwt access token in headers
    * - IParamIdState for getting id from url string ...thread/:id
    */
   public static async deleteThreadEndPoint(ctx: IParamContext<IAuthState, IParamIdState>) {
      try {
         await del(ctx.state.user, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion endpoints
   //#region middlewares
   /**
    * Middleware - Get method for getting target thread by id and decoded user from access tokend after save this in ctx.state.thread
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    * - IParamIdState - interface for getting id from url string ...thread/:id
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async threadMiddleware(ctx: IParamContext<IThreadState, IParamIdState>, next: Next): Promise<void> {
      try {
         const thread = await get(ctx.state.user, ctx.params.id);
         ctx.state.thread = thread;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion middlewares
}
