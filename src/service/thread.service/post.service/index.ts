import { post as target, posts as all, create, update, del } from "./crud";
import { Next } from "koa";
import { IContext, IThreadState, IPostState, IParamContext, IParamIdState, IPostBody } from "../../../types";

/**
 * Class controller for post routes(/user/thread/(:threadid)/post)
 */
export default class postController {
   //#region 'EndPoints'
   /**
    * Endpoint - GET method for route /post. Return posts array for current thread with status 200
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    */

   public static async postsEndPoint(ctx: IContext<IThreadState>): Promise<void> {
      try {
         const posts = await all(ctx.state.thread);
         ctx.status = 200;
         ctx.body = posts;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   /**
    * Endpoints - GET method for route /post/:id, return target post by id in current thread witj status 200
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    */
   public static async postEndPoint(ctx: IParamContext<IThreadState, IParamIdState>): Promise<void> {
      try {
         const post = await target(ctx.state.thread, ctx.params.id);
         ctx.status = 200;
         ctx.body = post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * Endpoint - POST method for route /post. Create new post for current thread. Return created post with status 201
    * @ inputs:
    * - expireDate - date for post creating;
    * - context - post body.
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    */
   public static async postCreateEndPoint(ctx: IContext<IThreadState>): Promise<void> {
      try {
         const post = await create(ctx.state.thread, {
            context: ctx.request.body.context,
            expireDate: new Date(ctx.request.body.expireDate),
         });
         ctx.status = 201;
         ctx.body = post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   /**
    * Endpoint - PUT method for route /post/:id. Udpate post by id. return updated post with status 200
    * @ inputs:
    * - expireDate - date for post creating;
    * - context - post body.
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    */
   public static async postUpdateEndPoint(ctx: IParamContext<IThreadState, IParamIdState>) {
      try {
         const post = await update(ctx.state.thread, ctx.params.id, {
            context: ctx.request.body.context,
            expireDate: new Date(ctx.request.body.expireDate),
         });
         ctx.status = 200;
         ctx.body = post;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    *Endpoint - DELETE method for route /post:id. Delete target post by id. Return status 204
    * @param ctx Context - Koa context supplemented by state IThreadState
    * - IThreadState Interface - realizes ctx.state param thread, extends from IAuthState
    */
   public static async postDeleteEndPoint(ctx: IParamContext<IThreadState, IParamIdState>) {
      try {
         const post = await del(ctx.state.thread, ctx.params.id);
         ctx.status = 204;
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion 'EndPoints'
   //#region  'Middlewares'
   /**
    * Uselss now. FOR FUTURE!!
    */
   public static async postsMiddleware(ctx: IContext<IPostState>, next: Next) {}
   /**
    * Middleware - GET method for route /post/:id. saves target post of the current thread in ctx.state.post for next middleware chain
    * @param  ctx Context - Koa context supplemented by state IPostState. IPostState Interface - realizes ctx.state additional param post, extends from IThradState
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async postMiddleware(ctx: IParamContext<IPostState, IParamIdState>, next: Next) {
      try {
         const post = await target(ctx.state.thread, ctx.params.id);
         ctx.state.post = post;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * Middleware - POST method for route .post. Create new post for current thread and save in ctx.state.post for next middleware chain
    * * @ inputs:
    * - expireDate - date for post creating;
    * - context - post body.
    * @param  ctx Context - Koa context supplemented by state IPostState. IPostState Interface - realizes ctx.state additional param post, extends from IThradState
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async postCreateMiddleware(ctx: IContext<IPostState>, next: Next) {
      try {
         const post = await create(ctx.state.thread, {
            context: ctx.request.body.context,
            expireDate: new Date(ctx.request.body.expireDate),
         });
         ctx.state.post = post;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * Middleware - PUT method for route /post/:id. Update target post and saves to ctx.state.post for next chain
    * * @ inputs:
    * - expireDate - date for post creating;
    * - context - post body.
    * @param  ctx Context - Koa context supplemented by state IPostState. IPostState Interface - realizes ctx.state additional param post, extends from IThradState
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async postUpdateMiddleware(ctx: IParamContext<IPostState, IParamIdState>, next: Next) {
      try {
         const post = await update(ctx.state.thread, ctx.params.id, <IPostBody>{
            context: ctx.request.body.context,
            expireDate: new Date(ctx.request.body.expireDate),
         });
         ctx.state.post = post;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }

   /**
    * Middelware - DELETE method for route /post/:id. Delete target post and saves that to ctx.state.post for next chain. Important for identify
    *  @param  ctx Context - Koa context supplemented by state IPostState. IPostState Interface - realizes ctx.state additional param post, extends from IThradState
    * @param next Next - Connection mechanics for realizing next step middleware execution
    */
   public static async postDeleteMiddleware(ctx: IParamContext<IPostState, IParamIdState>, next: Next) {
      try {
         const post = await del(ctx.state.thread, ctx.params.id);
         ctx.state.post = post;
         await next();
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   //#endregion 'Middlewares
}
